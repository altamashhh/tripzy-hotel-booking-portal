
package com.tripzy.service;

import com.tripzy.entity.Hotel;
import com.tripzy.entity.RoomType;
import com.tripzy.repository.RoomTypeRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Set;

@Service
public class RecommendationService {

    private final RoomTypeRepository roomTypeRepository;

    public RecommendationService(RoomTypeRepository roomTypeRepository) {
        this.roomTypeRepository = roomTypeRepository;
    }

    public List<RoomType> recommendRooms(
            String location,
            BigDecimal maxBudget,
            Integer guests,
            String tripPurpose,
            String travellerType,
            String stayPreference) {

        validateInputs(location, maxBudget, guests);

        String destination = location.trim().toLowerCase(Locale.ROOT);

        return roomTypeRepository.findAll()
                .stream()
                .filter(RoomType::isActive)
                .filter(room -> room.getHotel() != null)
                .filter(room -> room.getHotel().isActive())
                .filter(room -> room.getHotel().getLocation()
                        .toLowerCase(Locale.ROOT).contains(destination))
                .filter(room -> room.getPricePerNight()
                        .compareTo(maxBudget) <= 0)
                .filter(room -> room.getCapacity() >= guests)
                .sorted(
                        Comparator
                                .comparingInt((RoomType room) ->
                                        calculateScore(
                                                room,
                                                maxBudget,
                                                tripPurpose,
                                                travellerType,
                                                stayPreference
                                        ))
                                .reversed()
                                .thenComparing(RoomType::getPricePerNight)
                )
                .toList();
    }

    private void validateInputs(
            String location,
            BigDecimal maxBudget,
            Integer guests) {

        if (location == null || location.isBlank()) {
            throw new IllegalArgumentException(
                    "Please enter a destination.");
        }

        if (maxBudget == null ||
                maxBudget.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException(
                    "Maximum budget must be greater than zero.");
        }

        if (guests == null || guests <= 0) {
            throw new IllegalArgumentException(
                    "Number of guests must be at least one.");
        }
    }

    // Calculate a preference matching score
    public int calculateScore(
            RoomType room,
            BigDecimal maxBudget,
            String tripPurpose,
            String travellerType,
            String stayPreference) {

        int score = 0;

        Hotel hotel = room.getHotel();
        Set<String> amenities = hotel.getAmenities();

        String category = room.getCategory().toLowerCase(Locale.ROOT);
        String description = (
                room.getDescription() + " " + hotel.getDescription()
        ).toLowerCase(Locale.ROOT);

        String purpose = normalize(tripPurpose);
        String traveller = normalize(travellerType);
        String preference = normalize(stayPreference);

        // Stay preference
        if (preference.equals("budget")
                && room.getPricePerNight()
                .compareTo(new BigDecimal("4000")) <= 0) {
            score += 25;
        } else if (preference.equals("mid-range")
                && room.getPricePerNight()
                .compareTo(new BigDecimal("4000")) > 0
                && room.getPricePerNight()
                .compareTo(new BigDecimal("7000")) <= 0) {
            score += 25;
        } else if (preference.equals("luxury")
                && room.getPricePerNight()
                .compareTo(new BigDecimal("7000")) > 0) {
            score += 25;
        }

        // Trip purpose
        switch (purpose) {
            case "business" -> {
                if (contains(amenities, "business lounge")
                        || description.contains("workspace")) {
                    score += 20;
                }
                if (contains(amenities, "wifi")) score += 5;
            }
            case "romantic" -> {
                if (contains(amenities, "spa")
                        || description.contains("suite")
                        || description.contains("sea view")) {
                    score += 20;
                }
            }
            case "adventure" -> {
                if (contains(amenities, "mountain view")
                        || description.contains("mountain")
                        || description.contains("valley")) {
                    score += 20;
                }
            }
            case "relaxation" -> {
                if (contains(amenities, "spa")
                        || contains(amenities, "swimming pool")
                        || contains(amenities, "garden")) {
                    score += 20;
                }
            }
            case "leisure", "family vacation" -> {
                if (contains(amenities, "restaurant")
                        || contains(amenities, "swimming pool")) {
                    score += 15;
                }
            }
            default -> { }
        }

        // Traveller type
        switch (traveller) {
            case "solo" -> {
                if (room.getCapacity() >= 1) score += 10;
            }
            case "couple" -> {
                if (room.getCapacity() >= 2) score += 10;
                if (description.contains("king-size")
                        || category.contains("premium")
                        || category.contains("suite")) {
                    score += 5;
                }
            }
            case "family" -> {
                if (room.getCapacity() >= 3) score += 15;
                if (contains(amenities, "swimming pool")
                        || contains(amenities, "garden")) {
                    score += 5;
                }
            }
            case "friends" -> {
                if (room.getCapacity() >= 3) score += 15;
            }
            default -> { }
        }

        // Reward rooms that use a reasonable portion of the budget
        if (room.getPricePerNight()
                .compareTo(maxBudget.multiply(new BigDecimal("0.8"))) <= 0) {
            score += 5;
        }

        return score;
    }

    public String getRecommendationReason(
            RoomType room,
            BigDecimal maxBudget,
            Integer guests,
            String tripPurpose,
            String travellerType,
            String stayPreference) {

        return "Recommended for your "
                + tripPurpose.toLowerCase(Locale.ROOT)
                + " trip as a "
                + travellerType.toLowerCase(Locale.ROOT)
                + " traveller. This room accommodates "
                + guests
                + " guest(s), matches your "
                + stayPreference.toLowerCase(Locale.ROOT)
                + " stay preference and is within your ₹"
                + maxBudget
                + " nightly budget.";
    }

    private boolean contains(Set<String> amenities, String value) {
        return amenities != null && amenities.stream()
                .anyMatch(item -> item.equalsIgnoreCase(value));
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}


package com.tripzy.controller;

import com.tripzy.entity.RoomType;
import com.tripzy.service.RecommendationService;

import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/recommendations")
@CrossOrigin(origins = "http://localhost:5173")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(
            RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    public record RecommendationResponse(
            Long roomTypeId,
            String hotelName,
            String location,
            String roomCategory,
            String description,
            BigDecimal pricePerNight,
            Integer capacity,
            String recommendationReason,
            Integer recommendationScore
    ) {}

    @GetMapping
    public List<RecommendationResponse> recommendRooms(
            @RequestParam String location,
            @RequestParam BigDecimal maxBudget,
            @RequestParam Integer guests,
            @RequestParam(defaultValue = "Leisure") String tripPurpose,
            @RequestParam(defaultValue = "Solo") String travellerType,
            @RequestParam(defaultValue = "Mid-range") String stayPreference) {

        List<RoomType> rooms = recommendationService.recommendRooms(
                location,
                maxBudget,
                guests,
                tripPurpose,
                travellerType,
                stayPreference
        );

        return rooms.stream()
                .map(room -> new RecommendationResponse(
                        room.getId(),
                        room.getHotel().getName(),
                        room.getHotel().getLocation(),
                        room.getCategory(),
                        room.getDescription(),
                        room.getPricePerNight(),
                        room.getCapacity(),
                        recommendationService.getRecommendationReason(
                                room,
                                maxBudget,
                                guests,
                                tripPurpose,
                                travellerType,
                                stayPreference
                        ),
                        recommendationService.calculateScore(
                                room,
                                maxBudget,
                                tripPurpose,
                                travellerType,
                                stayPreference
                        )
                ))
                .toList();
    }
}

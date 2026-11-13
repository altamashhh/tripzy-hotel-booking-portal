
package com.tripzy.config;

import com.tripzy.entity.Hotel;
import com.tripzy.entity.RoomType;
import com.tripzy.repository.HotelRepository;
import com.tripzy.repository.RoomTypeRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;

    public DataInitializer(
            HotelRepository hotelRepository,
            RoomTypeRepository roomTypeRepository) {

        this.hotelRepository = hotelRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    @Override
    public void run(String... args) {

        System.out.println("Checking Tripzy sample hotel data...");

        // MUMBAI

        addHotel(
                "Seabreeze Residency",
                "Mumbai, Maharashtra",
                "A premium city hotel offering comfortable accommodation near Mumbai's coastline.",
                Set.of("WiFi", "Swimming Pool", "Restaurant", "AC", "Parking"),
                "Deluxe Room",
                "Spacious room with city views and modern amenities.",
                "4500.00", 2, 20
        );

        addHotel(
                "The Marine Crown",
                "Mumbai, Maharashtra",
                "An upscale waterfront hotel offering elegant rooms and premium dining experiences.",
                Set.of("WiFi", "Sea View", "Swimming Pool", "Spa", "Restaurant", "AC", "Parking"),
                "Premium Sea View Room",
                "Elegant room with sea views, king-size bed and premium facilities.",
                "7200.00", 2, 15
        );

        addHotel(
                "Harbour View Suites",
                "Mumbai, Maharashtra",
                "A comfortable and affordable city hotel ideal for solo travellers and business visitors.",
                Set.of("WiFi", "AC", "Parking", "Restaurant", "Room Service"),
                "Standard Room",
                "Practical and comfortable room with essential amenities.",
                "3200.00", 2, 25
        );

        // GOA

        addHotel(
                "Palm Grove Retreat",
                "Goa",
                "A relaxing tropical retreat with easy access to popular beaches.",
                Set.of("WiFi", "Swimming Pool", "Beach Access", "Restaurant", "AC"),
                "Premium Room",
                "Comfortable room designed for a relaxing beach vacation.",
                "5500.00", 2, 15
        );

        addHotel(
                "Azure Sands Resort",
                "Goa",
                "A luxury beach resort featuring spacious suites, tropical gardens and premium leisure facilities.",
                Set.of("WiFi", "Private Beach", "Swimming Pool", "Spa", "Restaurant", "AC", "Gym"),
                "Luxury Suite",
                "Spacious luxury suite with balcony and resort views.",
                "8500.00", 3, 12
        );

        addHotel(
                "Coconut Bay Retreat",
                "Goa",
                "A budget-friendly tropical stay surrounded by greenery and close to popular beaches.",
                Set.of("WiFi", "Garden", "Restaurant", "AC", "Parking"),
                "Garden Room",
                "Cozy room overlooking the tropical garden.",
                "3500.00", 2, 18
        );

        // JAIPUR

        addHotel(
                "Aravali Grand Stay",
                "Jaipur, Rajasthan",
                "A heritage-inspired hotel combining traditional architecture with modern comfort.",
                Set.of("WiFi", "Restaurant", "Parking", "AC", "Room Service"),
                "Heritage Room",
                "Traditional interiors with comfortable furnishings.",
                "3800.00", 2, 18
        );

        addHotel(
                "Rajputana Palace",
                "Jaipur, Rajasthan",
                "A luxury heritage property inspired by royal Rajasthani architecture and hospitality.",
                Set.of("WiFi", "Swimming Pool", "Spa", "Fine Dining", "AC", "Garden", "Parking"),
                "Royal Suite",
                "Royal-style suite with elegant interiors and premium furnishings.",
                "7800.00", 3, 10
        );

        addHotel(
                "Pink City Heritage Inn",
                "Jaipur, Rajasthan",
                "A charming and affordable heritage-inspired stay close to Jaipur's historic attractions.",
                Set.of("WiFi", "Restaurant", "AC", "Parking", "Room Service"),
                "Classic Heritage Room",
                "Comfortable room with traditional decor and essential facilities.",
                "2900.00", 2, 22
        );

        // BENGALURU

        addHotel(
                "Urban Nest Suites",
                "Bengaluru, Karnataka",
                "A modern business hotel suitable for corporate travellers and families.",
                Set.of("WiFi", "Gym", "Restaurant", "AC", "Business Lounge"),
                "Executive Room",
                "Modern room with workspace and premium facilities.",
                "4200.00", 2, 25
        );

        addHotel(
                "Silicon Garden Hotel",
                "Bengaluru, Karnataka",
                "A premium urban hotel designed for business travellers and luxury city stays.",
                Set.of("WiFi", "Swimming Pool", "Gym", "Business Lounge", "Restaurant", "AC", "Parking"),
                "Business Suite",
                "Spacious business suite with dedicated workspace and lounge area.",
                "7500.00", 2, 14
        );

        addHotel(
                "The Orchid Residency",
                "Bengaluru, Karnataka",
                "A welcoming and affordable hotel offering convenient accommodation for families and solo visitors.",
                Set.of("WiFi", "Restaurant", "AC", "Parking", "Room Service"),
                "Comfort Room",
                "Well-furnished room with comfortable bedding and essential amenities.",
                "3100.00", 3, 20
        );

        // MANALI

        addHotel(
                "Pinecrest Mountain Lodge",
                "Manali, Himachal Pradesh",
                "A peaceful mountain lodge offering scenic surroundings and comfortable stays.",
                Set.of("WiFi", "Mountain View", "Restaurant", "Parking", "Heating"),
                "Mountain View Room",
                "Room featuring beautiful mountain views.",
                "5000.00", 2, 12
        );

        addHotel(
                "Snowpeak Retreat",
                "Manali, Himachal Pradesh",
                "A premium mountain resort offering luxury accommodation and panoramic Himalayan views.",
                Set.of("WiFi", "Mountain View", "Fireplace", "Spa", "Restaurant", "Heating", "Parking"),
                "Premium Mountain Suite",
                "Luxury suite with mountain views, fireplace and spacious interiors.",
                "8200.00", 3, 10
        );

        addHotel(
                "Himalayan Vista Resort",
                "Manali, Himachal Pradesh",
                "A peaceful and affordable mountain resort ideal for couples and families.",
                Set.of("WiFi", "Mountain View", "Restaurant", "Heating", "Parking", "Garden"),
                "Valley View Room",
                "Comfortable room with beautiful valley views and cozy interiors.",
                "3600.00", 4, 16
        );

        System.out.println("Tripzy hotel data check completed.");
        System.out.println("Total hotels: " + hotelRepository.count());
        System.out.println("Total room types: " + roomTypeRepository.count());
    }

    private void addHotel(
            String name,
            String location,
            String description,
            Set<String> amenities,
            String category,
            String roomDescription,
            String price,
            int capacity,
            int totalRooms) {

        // Prevent duplicate hotels while allowing new hotels to be added
        boolean alreadyExists = hotelRepository.findAll()
                .stream()
                .anyMatch(hotel -> hotel.getName().equalsIgnoreCase(name));

        if (alreadyExists) {
            System.out.println("Hotel already exists: " + name);
            return;
        }

        Hotel hotel = new Hotel();

        hotel.setName(name);
        hotel.setLocation(location);
        hotel.setDescription(description);
        hotel.setAmenities(new HashSet<>(amenities));
        hotel.setActive(true);

        Hotel savedHotel = hotelRepository.save(hotel);

        RoomType roomType = new RoomType();

        roomType.setHotel(savedHotel);
        roomType.setCategory(category);
        roomType.setDescription(roomDescription);
        roomType.setPricePerNight(new BigDecimal(price));
        roomType.setCapacity(capacity);
        roomType.setTotalRooms(totalRooms);
        roomType.setActive(true);

        roomTypeRepository.save(roomType);

        System.out.println("Added hotel: " + name);
    }
}

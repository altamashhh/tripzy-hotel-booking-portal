
package com.tripzy.service;

import com.tripzy.entity.Booking;
import com.tripzy.entity.BookingStatus;
import com.tripzy.entity.Hotel;
import com.tripzy.entity.RoomType;
import com.tripzy.repository.BookingRepository;
import com.tripzy.repository.HotelRepository;
import com.tripzy.repository.RoomTypeRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class HotelService {

    private final HotelRepository hotelRepository;
    private final RoomTypeRepository roomTypeRepository;
    private final BookingRepository bookingRepository;

    public HotelService(
            HotelRepository hotelRepository,
            RoomTypeRepository roomTypeRepository,
            BookingRepository bookingRepository) {

        this.hotelRepository = hotelRepository;
        this.roomTypeRepository = roomTypeRepository;
        this.bookingRepository = bookingRepository;
    }

    // Get all active hotels
    public List<Hotel> getAllHotels() {
        return hotelRepository.findByActiveTrue();
    }

    // Get hotel by ID
    public Hotel getHotelById(Long id) {

        return hotelRepository.findByIdAndActiveTrue(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Hotel not found with ID: " + id
                        )
                );
    }

    // Search hotels by location
    public List<Hotel> searchHotelsByLocation(String location) {

        if (location == null || location.isBlank()) {
            return getAllHotels();
        }

        return hotelRepository
                .findByLocationContainingIgnoreCaseAndActiveTrue(
                        location.trim()
                );
    }

    // Get all active room types for a hotel
    public List<RoomType> getRoomTypesByHotel(Long hotelId) {

        getHotelById(hotelId);

        return roomTypeRepository
                .findByHotel_IdAndActiveTrue(hotelId);
    }

    // Search hotels with available rooms for requested dates
    public List<Hotel> searchAvailableHotels(
            String location,
            LocalDate checkInDate,
            LocalDate checkOutDate) {

        validateSearchDates(checkInDate, checkOutDate);

        List<Hotel> hotels = searchHotelsByLocation(location);

        return hotels.stream()
                .filter(hotel -> {
                    List<RoomType> roomTypes =
                            roomTypeRepository
                                    .findByHotel_IdAndActiveTrue(hotel.getId());

                    return roomTypes.stream()
                            .anyMatch(roomType ->
                                    hasAvailability(
                                            roomType,
                                            checkInDate,
                                            checkOutDate
                                    ));
                })
                .toList();
    }

    // Check whether a room type has availability throughout the stay
    private boolean hasAvailability(
            RoomType roomType,
            LocalDate checkInDate,
            LocalDate checkOutDate) {

        List<Booking> overlappingBookings =
                bookingRepository.findOverlappingBookings(
                        roomType.getId(),
                        BookingStatus.CONFIRMED,
                        checkOutDate,
                        checkInDate
                );

        long maxReservedRooms = 0;

        for (LocalDate date = checkInDate;
             date.isBefore(checkOutDate);
             date = date.plusDays(1)) {

            LocalDate currentDate = date;

            long reservedRooms = overlappingBookings.stream()
                    .filter(booking ->
                            !booking.getCheckInDate().isAfter(currentDate)
                            && booking.getCheckOutDate().isAfter(currentDate))
                    .mapToLong(Booking::getNumberOfRooms)
                    .sum();

            maxReservedRooms = Math.max(
                    maxReservedRooms,
                    reservedRooms
            );
        }

        return maxReservedRooms < roomType.getTotalRooms();
    }

    // Validate search dates
    private void validateSearchDates(
            LocalDate checkInDate,
            LocalDate checkOutDate) {

        if (checkInDate == null || checkOutDate == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Check-in and check-out dates are required."
            );
        }

        if (checkInDate.isBefore(LocalDate.now())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Check-in date cannot be in the past."
            );
        }

        if (!checkOutDate.isAfter(checkInDate)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Check-out must be after check-in."
            );
        }
    }
}


package com.tripzy.service;

import com.tripzy.entity.Booking;
import com.tripzy.entity.BookingStatus;
import com.tripzy.entity.RoomType;
import com.tripzy.repository.BookingRepository;
import com.tripzy.repository.RoomTypeRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.UUID;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomTypeRepository roomTypeRepository;

    public BookingService(
            BookingRepository bookingRepository,
            RoomTypeRepository roomTypeRepository) {

        this.bookingRepository = bookingRepository;
        this.roomTypeRepository = roomTypeRepository;
    }

    // 1. Create Booking
    @Transactional
    public Booking createBooking(
            String guestName,
            String guestEmail,
            Long roomTypeId,
            LocalDate checkInDate,
            LocalDate checkOutDate) {

        // Validate guest details
        if (guestName == null || guestName.isBlank()) {
            throw new IllegalArgumentException(
                    "Guest name is required.");
        }

        if (guestEmail == null || guestEmail.isBlank()) {
            throw new IllegalArgumentException(
                    "Guest email is required.");
        }

        // Validate dates
        if (checkInDate == null || checkOutDate == null) {
            throw new IllegalArgumentException(
                    "Check-in and check-out dates are required.");
        }

        if (checkInDate.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Check-in date cannot be in the past.");
        }

        if (!checkOutDate.isAfter(checkInDate)) {
            throw new IllegalArgumentException(
                    "Check-out must be after check-in.");
        }

        // Retrieve and lock room type
        RoomType roomType = roomTypeRepository
                .findByIdForUpdate(roomTypeId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Room type not found."));

        if (!roomType.isActive()) {
            throw new IllegalArgumentException(
                    "This room type is currently unavailable.");
        }

        // Calculate nights
        long nights = ChronoUnit.DAYS.between(
                checkInDate, checkOutDate);

     // Find all overlapping confirmed bookings
var overlappingBookings = bookingRepository.findOverlappingBookings(
        roomTypeId,
        BookingStatus.CONFIRMED,
        checkOutDate,
        checkInDate
);

// Calculate maximum rooms occupied on any night
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

    maxReservedRooms = Math.max(maxReservedRooms, reservedRooms);
}

// Check room inventory
if (maxReservedRooms + 1 > roomType.getTotalRooms()) {
    throw new IllegalStateException(
            "Sorry, no rooms are available for these dates.");
}

        // Calculate total amount
        BigDecimal totalAmount = roomType.getPricePerNight()
                .multiply(BigDecimal.valueOf(nights));

        // Create booking
        Booking booking = new Booking();

        booking.setBookingReference(
                "TRP-" + UUID.randomUUID()
                        .toString()
                        .replace("-", "")
                        .substring(0, 10)
                        .toUpperCase(Locale.ROOT)
        );

        booking.setGuestName(guestName.trim());
        booking.setGuestEmail(guestEmail.trim());
        booking.setHotel(roomType.getHotel());
        booking.setRoomType(roomType);
        booking.setCheckInDate(checkInDate);
        booking.setCheckOutDate(checkOutDate);
        booking.setNumberOfRooms(1);
        booking.setTotalAmount(totalAmount);
        booking.setStatus(BookingStatus.CONFIRMED);

        return bookingRepository.save(booking);
    }

       // 2. Retrieve Booking with Email Verification
    @Transactional(readOnly = true)
    public Booking getBooking(String bookingReference, String guestEmail) {

        Booking booking = bookingRepository
                .findByBookingReference(bookingReference)
                .orElseThrow(() ->
                        new IllegalArgumentException("Booking not found"));

        if (guestEmail == null ||
            !booking.getGuestEmail().equalsIgnoreCase(guestEmail.trim())) {
            throw new IllegalArgumentException(
                    "Booking reference or email is incorrect");
        }

        return booking;
    }

    // 3. Cancel Booking with Email Verification
    @Transactional
    public Booking cancelBooking(String bookingReference, String guestEmail) {

        Booking booking = getBooking(bookingReference, guestEmail);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalArgumentException(
                    "Booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);

        return bookingRepository.save(booking);
    }
}

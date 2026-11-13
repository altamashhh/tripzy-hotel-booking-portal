
package com.tripzy.controller;

import com.tripzy.entity.Booking;
import com.tripzy.service.BookingService;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    // Request DTO
    public record BookingRequest(
            @NotBlank String guestName,
            @NotBlank @Email String guestEmail,
            @NotNull Long roomTypeId,
            @NotNull
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate checkInDate,
            @NotNull
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate checkOutDate
    ) {}

    // Response DTO
    public record BookingResponse(
            String bookingReference,
            String guestName,
            String guestEmail,
            String hotelName,
            String roomCategory,
            LocalDate checkInDate,
            LocalDate checkOutDate,
            BigDecimal totalAmount,
            String status
    ) {}

    // Get booking by reference
    

    @GetMapping("/{reference}")
        public ResponseEntity<BookingResponse> getBooking(
        @PathVariable String reference,
        @RequestParam String guestEmail) {

    Booking booking = bookingService.getBooking(reference, guestEmail);

    return ResponseEntity.ok(mapResponse(booking));
    }

    // Cancel booking
    @PutMapping("/{reference}/cancel")
    public ResponseEntity<BookingResponse> cancelBooking(
        @PathVariable String reference,
        @RequestParam String guestEmail) {

    Booking booking = bookingService.cancelBooking(reference, guestEmail);

    return ResponseEntity.ok(mapResponse(booking));
    }


    // Create booking
    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @Valid @RequestBody BookingRequest request) {

        Booking booking = bookingService.createBooking(
                request.guestName(),
                request.guestEmail(),
                request.roomTypeId(),
                request.checkInDate(),
                request.checkOutDate()
        );

        BookingResponse response = mapResponse(booking);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    private BookingResponse mapResponse(Booking booking) {
        return new BookingResponse(
                booking.getBookingReference(),
                booking.getGuestName(),
                booking.getGuestEmail(),
                booking.getHotel().getName(),
                booking.getRoomType().getCategory(),
                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                booking.getTotalAmount(),
                booking.getStatus().name()
        );
    }
}

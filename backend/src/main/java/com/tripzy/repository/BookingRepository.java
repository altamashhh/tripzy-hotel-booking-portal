
package com.tripzy.repository;

import com.tripzy.entity.Booking;
import com.tripzy.entity.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Find booking using unique booking reference
    Optional<Booking> findByBookingReference(String bookingReference);

    // Find all bookings made by a guest
    List<Booking> findByGuestEmailOrderByCreatedAtDesc(String guestEmail);

    // Find bookings associated with a particular hotel
    List<Booking> findByHotel_Id(Long hotelId);

    // Find bookings based on their status
    List<Booking> findByStatus(BookingStatus status);

   @Query("""
    SELECT b
    FROM Booking b
    WHERE b.roomType.id = :roomTypeId
      AND b.status = :status
      AND b.checkInDate < :requestedCheckOut
      AND b.checkOutDate > :requestedCheckIn
    """)
List<Booking> findOverlappingBookings(
    @Param("roomTypeId") Long roomTypeId,
    @Param("status") BookingStatus status,
    @Param("requestedCheckOut") LocalDate requestedCheckOut,
    @Param("requestedCheckIn") LocalDate requestedCheckIn
);

}

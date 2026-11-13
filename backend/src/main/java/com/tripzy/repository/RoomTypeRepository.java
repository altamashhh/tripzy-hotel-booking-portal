
package com.tripzy.repository;

import com.tripzy.entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {

    // Find all active room types of a hotel
    List<RoomType> findByHotel_IdAndActiveTrue(Long hotelId);

    // Find rooms within a price range
    List<RoomType> findByPricePerNightBetweenAndActiveTrue(
            BigDecimal minPrice,
            BigDecimal maxPrice
    );

    // Find room types by category
    List<RoomType> findByCategoryContainingIgnoreCaseAndActiveTrue(
            String category
    );

    // Lock room type during booking to prevent simultaneous overbooking
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT rt FROM RoomType rt WHERE rt.id = :id")
    Optional<RoomType> findByIdForUpdate(@Param("id") Long id);

    // Smart recommendation: match destination, budget and guest capacity
    @Query("""
        SELECT rt
        FROM RoomType rt
        JOIN rt.hotel h
        WHERE rt.active = true
          AND h.active = true
          AND LOWER(h.location) LIKE LOWER(CONCAT('%', :location, '%'))
          AND rt.pricePerNight <= :maxBudget
          AND rt.capacity >= :guests
        ORDER BY rt.pricePerNight ASC
    """)
    List<RoomType> findRecommendedRooms(
            @Param("location") String location,
            @Param("maxBudget") BigDecimal maxBudget,
            @Param("guests") Integer guests
    );
}

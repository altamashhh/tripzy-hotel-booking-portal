
package com.tripzy.repository;

import com.tripzy.entity.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {

    // Find all active hotels
    List<Hotel> findByActiveTrue();

    // Search hotels by name
    List<Hotel> findByNameContainingIgnoreCaseAndActiveTrue(String name);

    // Search hotels by location
    List<Hotel> findByLocationContainingIgnoreCaseAndActiveTrue(String location);

    // Find hotels by name or location
    List<Hotel> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseAndActiveTrue(
            String name, String location
    );
    Optional<Hotel> findByIdAndActiveTrue(Long id);
}

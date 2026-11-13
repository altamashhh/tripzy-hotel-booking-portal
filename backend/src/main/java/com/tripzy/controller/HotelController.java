
package com.tripzy.controller;

import com.tripzy.entity.Hotel;
import com.tripzy.entity.RoomType;
import com.tripzy.service.HotelService;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

import java.util.List;

@RestController
@RequestMapping("/api/hotels")
public class HotelController {

    private final HotelService hotelService;

    // Constructor Injection
    public HotelController(HotelService hotelService) {
        this.hotelService = hotelService;
    }

    // GET: Retrieve all hotels
    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    // GET: Retrieve hotel by ID
    @GetMapping("/{id}")
    public Hotel getHotelById(@PathVariable Long id) {
        return hotelService.getHotelById(id);
    }

    // GET: Search hotels by location
    @GetMapping("/search")
    public List<Hotel> searchHotels(
            @RequestParam String location) {

        return hotelService.searchHotelsByLocation(location);
    }

    // GET: Search hotels by location and date availability
    @GetMapping("/search/availability")
    public List<Hotel> searchAvailableHotels(
        @RequestParam String location,
        @RequestParam LocalDate checkInDate,
        @RequestParam LocalDate checkOutDate) {

    return hotelService.searchAvailableHotels(
            location,
            checkInDate,
            checkOutDate
    );
    }

    // GET: Retrieve room types for a hotel
    @GetMapping("/{id}/rooms")
    public List<RoomType> getHotelRooms(
            @PathVariable Long id) {

        return hotelService.getRoomTypesByHotel(id);
    }
}

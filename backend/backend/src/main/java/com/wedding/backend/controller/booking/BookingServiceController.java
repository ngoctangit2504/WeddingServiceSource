package com.wedding.backend.controller.booking;

import com.wedding.backend.dto.bookingService.BookingServiceDTO;
import com.wedding.backend.service.IService.booking.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("api/v1/booking-service")
@RequiredArgsConstructor
@CrossOrigin("*")
public class BookingServiceController {

    private final IBookingService service;

    @PostMapping(value = "/add", consumes = "application/json")
    public ResponseEntity<?> addBooking(@RequestBody BookingServiceDTO bookingServiceDTO) {
        return ResponseEntity.ok(service.addBooking(bookingServiceDTO));
    }

    @GetMapping("/booking-service-by-supplier-id")
    public ResponseEntity<?> getBookingByServiceBySupplierId(Principal connectedUser) {
        return ResponseEntity.ok(service.getBookingServiceBySupplierId(connectedUser));
    }
}

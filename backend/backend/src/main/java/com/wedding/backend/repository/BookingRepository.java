package com.wedding.backend.repository;

import com.wedding.backend.dto.bookingService.BookingServiceDTO;
import com.wedding.backend.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {
    List<BookingServiceDTO> findByServerBooking_Supplier_Id(Long supplierId);
}

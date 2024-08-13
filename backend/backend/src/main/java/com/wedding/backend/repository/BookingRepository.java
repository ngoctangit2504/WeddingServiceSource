package com.wedding.backend.repository;

import com.wedding.backend.dto.bookingService.BookingServicesBySupplier;
import com.wedding.backend.entity.BookingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<BookingEntity, Long> {

    @Query(value = "SELECT b.id, b.name as nameCustomer, b.email, b.created_date as createdDate, b.phone_number as phoneNumber, b.note, b.service_id as serviceId, s.title as titleService " +
            "FROM bookings as b " +
            "JOIN services as s ON b.service_id = s.id " +
            "JOIN supplier as sup ON s.supplier_id = sup.id " +
            "WHERE sup.id = :supplierID", nativeQuery = true)
    List<BookingServicesBySupplier> bookingServiceBySupplier(@Param("supplierID") Long supplierID);

}

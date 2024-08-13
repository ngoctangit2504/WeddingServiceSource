package com.wedding.backend.service.IService.booking;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.bookingService.BookingServiceDTO;
import com.wedding.backend.dto.bookingService.BookingServicesBySupplier;

import java.security.Principal;
import java.util.List;

public interface IBookingService {
    BaseResult addBooking(BookingServiceDTO bookingServiceDTO);

    BaseResultWithDataAndCount<List<BookingServicesBySupplier>> getBookingServiceBySupplierId(Principal connectedUser);
}

package com.wedding.backend.dto.bookingService;

import com.wedding.backend.common.StatusCommon;

import java.util.Date;

public interface BookingServicesBySupplier {
    Long getId();

    String getNameCustomer();

    String getEmail();

    Date getCreatedDate();

    String getPhoneNumber();

    String getNote();

    Long getServiceId();

    String getTitleService();

    StatusCommon getStatus();
}

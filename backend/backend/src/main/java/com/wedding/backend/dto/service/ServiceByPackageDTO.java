package com.wedding.backend.dto.service;

import java.util.Date;

public interface ServiceByPackageDTO {
    Long getId();

    String getTitle();

    String getImage();

    String getAddress();

    Date getCreatedDate();

    Date getPurchaseDate();

    Long getSupplierId();

    Integer getRn();
}

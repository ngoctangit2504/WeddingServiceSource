package com.wedding.backend.dto.service;

import java.util.Date;

public interface IServiceDTO {
    Long getId();

    String getTitle();

    String getAddress();

    Date getCreatedDate();

    String getImage();
}

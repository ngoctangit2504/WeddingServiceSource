package com.wedding.backend.dto.service;

import java.util.Date;

public interface ServiceBySuggest {
    Long getId();

    String getTitle();

    String getAddress();

    Date getCreatedDate();

    String getImage();

    Double getAverageRating();

}

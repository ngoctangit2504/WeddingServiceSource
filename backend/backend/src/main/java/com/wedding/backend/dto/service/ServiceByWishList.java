package com.wedding.backend.dto.service;

import java.math.BigDecimal;
import java.util.Date;

public interface ServiceByWishList {
     Long getId();
     String getTitle();
     String getAddress();
     Date getCreatedDate();
     String getImage();
     Long getWishListItemId();
}

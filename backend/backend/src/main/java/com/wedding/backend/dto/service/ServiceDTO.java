package com.wedding.backend.dto.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceDTO {
    private Long id;
    private String title;
    private String image;
    private String price;
    private String address;
    private boolean isDeleted;
    private String status;
    private ServiceTypeEntity serviceType;
    private Date createdDate;
}

package com.wedding.backend.dto.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ServiceTypeDTO {
    private Long id;
    private String name;
    private String description;
    private String iconURL;
    private String imageURL;

}

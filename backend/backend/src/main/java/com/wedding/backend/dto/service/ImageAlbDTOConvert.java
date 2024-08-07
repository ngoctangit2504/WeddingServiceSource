package com.wedding.backend.dto.service;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class ImageAlbDTOConvert {
    private String imageURL;
    private String albName;
}

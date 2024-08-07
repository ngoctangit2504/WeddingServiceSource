package com.wedding.backend.dto.service;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@Getter
@Setter
public class AlbumRequestDTO {
    private String albumName;
    private List<MultipartFile> images;
}

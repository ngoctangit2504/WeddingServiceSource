package com.wedding.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PartUser {
    private String userId;
    private String userName;
    private String phoneNumber;
    private String images;
}

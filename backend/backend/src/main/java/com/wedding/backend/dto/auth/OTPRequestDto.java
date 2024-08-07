package com.wedding.backend.dto.auth;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OTPRequestDto {
    private String userName;
    private String phoneNumber;
}

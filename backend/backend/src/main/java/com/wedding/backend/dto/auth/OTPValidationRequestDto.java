package com.wedding.backend.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OTPValidationRequestDto {
    private String userName;
    private String otpNumber;
}

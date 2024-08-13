package com.wedding.backend.service.IService.auth;

import com.wedding.backend.dto.auth.LoginDTO;
import com.wedding.backend.dto.auth.OTPValidationRequestDto;
import org.springframework.http.ResponseEntity;

public interface IAuthenticationService {
    ResponseEntity<?> register(RegisterDTO request);

    LoginResponse login(LoginDTO request);

    ResponseEntity<?> registerTwoFactor(OTPValidationRequestDto requestDto);
}

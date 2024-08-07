package com.wedding.backend.controller.auth;

import com.wedding.backend.dto.auth.LoginDTO;
import com.wedding.backend.dto.auth.OTPValidationRequestDto;
import com.wedding.backend.dto.auth.RegisterDTO;
import com.wedding.backend.service.IService.auth.IAuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin("http://localhost:5173/")
public class AuthenticationController {
    private final IAuthenticationService authentication;

    @Operation(
            description = "Must register by pre phoneNumber: +84 and Format role is [ROLE_CUSTOMER]",
            summary = "Endpoint For Register"
    )
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO request) {
        return ResponseEntity.ok(authentication.register(request));
    }

    @Operation(
            description = "Get OTP code from smart phone",
            summary = "Endpoint For Verification OTP code"
    )
    @PostMapping("/verification-otp")
    public ResponseEntity<?> verificationOTP(@RequestBody OTPValidationRequestDto requestDto) {
        return ResponseEntity.ok(authentication.registerTwoFactor(requestDto));
    }

    @Operation(
            description = "{ phoneNumber: +84332101032, password: Cuoikhi3001@ }",
            summary = "Endpoint For Register"
    )
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO request) {

        return ResponseEntity.ok(authentication.login(request));
    }

    @GetMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logout successfully!");
    }
}

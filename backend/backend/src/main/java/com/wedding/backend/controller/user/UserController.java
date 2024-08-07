package com.wedding.backend.controller.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.backend.dto.auth.OTPRequestDto;
import com.wedding.backend.dto.auth.OTPValidationRequestDto;
import com.wedding.backend.dto.user.UpdateProfileRequest;
import com.wedding.backend.dto.user.UserDTO;
import com.wedding.backend.service.IService.user.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/user")
@CrossOrigin("*")
public class UserController {

    private final IUserService userService;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllUsers(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                         @RequestParam(name = "size", required = false, defaultValue = "5") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    @GetMapping("/get/{userId}")
    public ResponseEntity<?> getUser(@RequestParam(name = "userId") String userId) {
        return ResponseEntity.ok(userService.getUser(userId));
    }

    @PostMapping(value = "/update-profile", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> updateProfile(@RequestParam(name = "profileRequest") String profileRequest,
                                           @RequestPart (required = false, name = "profileImage") @Valid MultipartFile profileImage, Principal connectedUser) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        UpdateProfileRequest profile = objectMapper.readValue(profileRequest, UpdateProfileRequest.class);

        return ResponseEntity.ok(userService.updateProfile(profile, profileImage, connectedUser));
    }

    @GetMapping("/view-profile")
    public UserDTO viewProfile(Principal connectedUser) {
        return userService.viewProfile(connectedUser);
    }

    @PostMapping("/sendOTP")
    public ResponseEntity<?> sendOTP(@RequestBody OTPRequestDto requestDto) {
        return userService.sendOTP(requestDto);
    }
    @PostMapping("/up-to-role-manage")
    public ResponseEntity<?> upRoleUserToManage(@RequestBody OTPValidationRequestDto otpValidationRequestDto, Principal connectedUser) {
        return userService.upRoleToManage(otpValidationRequestDto, connectedUser);
    }

}

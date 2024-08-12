package com.wedding.backend.service.IService.user;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.auth.OTPRequestDto;
import com.wedding.backend.dto.auth.OTPValidationRequestDto;
import com.wedding.backend.dto.user.UpdateProfileRequest;
import com.wedding.backend.dto.user.UserDTO;
import com.wedding.backend.entity.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;

public interface IUserService {
    Optional<UserEntity> findByPhoneNumber(String phoneNumber);

    BaseResultWithDataAndCount<List<UserDTO>> getAllUsers(Pageable pageable);

    BaseResultWithData<UserDTO> getUser(String userId);

    UserDTO viewProfile(Principal connectedUser);

    ResponseEntity<?> upRoleToManage(OTPValidationRequestDto otpValidationRequestDto, Principal connectedUser);

    BaseResult updateProfile(UpdateProfileRequest profile, MultipartFile images, Principal connectedUser) throws IOException;

    ResponseEntity<?> sendOTP(OTPRequestDto requestDto);

    ResponseEntity<?> findAllByIsDeletedIsFalse(Pageable pageable);

    ResponseEntity<?> findAllByIsDeletedIsTrue(Pageable pageable);

    ResponseEntity<?> findAllAccountByRoleName(Pageable pageable, String roleName);

    ResponseEntity<?> deleteUserByIds(String[] listId);

}

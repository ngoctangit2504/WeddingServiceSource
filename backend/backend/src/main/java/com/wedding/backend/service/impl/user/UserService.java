package com.wedding.backend.service.impl.user;

import com.cloudinary.Cloudinary;
import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.common.ModelCommon;
import com.wedding.backend.dto.auth.LoginResponse;
import com.wedding.backend.dto.auth.OTPRequestDto;
import com.wedding.backend.dto.auth.OTPValidationRequestDto;
import com.wedding.backend.dto.auth.ResponseSendOTP;
import com.wedding.backend.dto.user.UpdateProfileRequest;
import com.wedding.backend.dto.user.UserDTO;
import com.wedding.backend.entity.RoleEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.exception.ResourceNotFoundException;
import com.wedding.backend.mapper.UserMapper;
import com.wedding.backend.repository.RoleRepository;
import com.wedding.backend.repository.UserRepository;
import com.wedding.backend.service.IService.user.IUserService;
import com.wedding.backend.service.impl.auth.JWTService;
import com.wedding.backend.service.impl.twilio.TwilioOTPService;
import com.wedding.backend.util.handler.TokenHandler;
import com.wedding.backend.util.message.MessageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_CUSTOMER')")
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final Cloudinary cloudinary;
    private final TwilioOTPService twilioOTPService;
    private final RoleRepository roleRepository;
    private final JWTService jwtService;
    private final TokenHandler tokenHandler;

    @Override
    public Optional<UserEntity> findByPhoneNumber(String phoneNumber) {
        return userRepository.findByPhoneNumber(phoneNumber);
    }

    @Override
    public BaseResultWithDataAndCount<List<UserDTO>> getAllUsers(Pageable pageable) {
        BaseResultWithDataAndCount<List<UserDTO>> baseResultWithDataAndCount = new BaseResultWithDataAndCount<>();
        try {
            List<UserDTO> userDTOList = userRepository.findAllByIsDeletedFalse(pageable)
                    .stream()
                    .map(userEntity -> userMapper.entityToDto(userEntity))
                    .toList();
            Long countAllResultCustomer = userRepository.countAllByIsDeletedFalse();
            baseResultWithDataAndCount.set(userDTOList, countAllResultCustomer);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return baseResultWithDataAndCount;
    }

    @Override
    public BaseResultWithData<UserDTO> getUser(String userId) {
        BaseResultWithData<UserDTO> baseResultWithData = new BaseResultWithData<>();
        try {
            Optional<UserEntity> userFromDb = userRepository.findById(userId);
            if (userFromDb.isPresent()) {
                UserDTO userDTO = userMapper.entityToDto(userFromDb.get());
                baseResultWithData.Set(true, MessageUtil.MSG_PROCESS_SUCCESS, userDTO);
            } else {
                baseResultWithData.Set(false, MessageUtil.MSG_USER_BY_ID_NOT_FOUND, null);
            }
        } catch (Exception ex) {
            baseResultWithData.Set(false, ex.getMessage(), null);
        }
        return baseResultWithData;
    }

    private void checkIfCustomerExitsOrThrow(String userId) {
        Optional<UserEntity> userEntity = userRepository.findById(userId);
        if (userEntity.isEmpty()) {
            throw new ResourceNotFoundException(
                    "User with id [%s] not found".formatted(userId)
            );
        }
    }

    @Override
    public UserDTO viewProfile(Principal connectedUser) {
        var userEntity = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
        return userMapper.entityToDto(userEntity);
    }

    @Override
    public BaseResult updateProfile(UpdateProfileRequest profileRequest, MultipartFile images, Principal connectedUser) throws IOException {
        try {
            var userEntity = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            // Chua te if-else
            if (profileRequest.getUserName() != null) {
                userEntity.setUserName(profileRequest.getUserName());
            }
            if (profileRequest.getEmail() != null) {
                userEntity.setEmail(profileRequest.getEmail());
            }
            if (profileRequest.getDateOfBirth() != null) {
                userEntity.setDateOfBirth(profileRequest.getDateOfBirth());
            }
            if (profileRequest.getAddress() != null) {
                userEntity.setAddress(profileRequest.getAddress());
            }
            if (images != null) {
                userEntity.setProfileImage(getFileUrls(images));
            }
            userRepository.save(userEntity);
            return new BaseResult(true, "Cập nhật thông tin thành công!");
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }

    private String getFileUrls(MultipartFile multipartFile) throws IOException {
        return cloudinary.uploader()
                .upload(multipartFile.getBytes(), Map.of("public_id", UUID.randomUUID().toString()))
                .get("url")
                .toString();
    }

    @Override
    public ResponseEntity<?> sendOTP(OTPRequestDto requestDto) {
        ResponseEntity<?> response = null;
        try {
            ResponseSendOTP result = twilioOTPService.sendSMS(requestDto);
            response = new ResponseEntity<>(result, HttpStatus.OK);

        } catch (Exception ex) {
            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> findAllByIsDeletedIsFalse(Pageable pageable) {
        ResponseEntity<?> response = null;
        BaseResultWithDataAndCount<List<UserDTO>> resultWithDataAndCount = new BaseResultWithDataAndCount<>();
        try {
            RoleEntity roleAdmin = roleRepository.findByName(ModelCommon.ADMIN);
            List<UserDTO> userDtoList = userRepository.findAllByIsDeletedFalse(pageable)
                    .stream()
                    .map(userEntity -> userMapper.entityToDto(userEntity))
                    .filter(userDto -> !userDto.getRoles().contains(roleAdmin))
                    .collect(Collectors.toList());
            Long count = userRepository.countAllByIsDeletedFalse();
            resultWithDataAndCount.set(userDtoList, count);
            response = new ResponseEntity<>(resultWithDataAndCount, HttpStatus.OK);
        } catch (Exception ex) {
            response = new ResponseEntity<>(MessageUtil.MSG_SYSTEM_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> findAllByIsDeletedIsTrue(Pageable pageable) {
        ResponseEntity<?> response = null;
        BaseResultWithDataAndCount<List<UserDTO>> resultWithDataAndCount = new BaseResultWithDataAndCount<>();
        try {
            List<UserDTO> userDtoList = userRepository.findAllByIsDeletedTrue(pageable)
                    .stream()
                    .map(userEntity -> userMapper.entityToDto(userEntity))
                    .collect(Collectors.toList());
            Long count = userRepository.countAllByIsDeletedTrue();
            resultWithDataAndCount.set(userDtoList, count);
            response = new ResponseEntity<>(resultWithDataAndCount, HttpStatus.OK);
        } catch (Exception ex) {
            response = new ResponseEntity<>(MessageUtil.MSG_SYSTEM_ERROR, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> findAllAccountByRoleName(Pageable pageable, String roleName) {
        ResponseEntity<?> response = null;
        BaseResultWithDataAndCount<List<UserDTO>> resultWithDataAndCount = new BaseResultWithDataAndCount<>();
        try {
            RoleEntity roleAdmin = roleRepository.findByName(ModelCommon.ADMIN);
            List<UserDTO> userDtos = userRepository.findAllByRoles_NameAndIsDeletedFalse(roleName)
                    .stream()
                    .map(userEntity -> userMapper.entityToDto(userEntity))
                    .filter(userDto -> !userDto.getRoles().contains(roleAdmin))
                    .collect(Collectors.toList());
            Long count = userRepository.countByRoles_NameAndIsDeletedFalse(roleName);
            resultWithDataAndCount.set(userDtos, count);
            response = new ResponseEntity<>(resultWithDataAndCount, HttpStatus.OK);
        } catch (Exception ex) {
            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> deleteUserByIds(String[] listId) {
        ResponseEntity<?> response = null;
        long count = 0L;
        try {
            for (String item : listId
            ) {
                Optional<UserEntity> user = userRepository.findById(item);
                user.ifPresent(userEntity -> userEntity.setDeleted(true));
                count++;
            }
            response = new ResponseEntity<>(new BaseResult(true, MessageUtil.MSG_DELETE_SUCCESS + " " + count + " tài khoản."), HttpStatus.OK);
        } catch (Exception ex) {
            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> upRoleToManage(OTPValidationRequestDto otpValidationRequestDto, Principal connectedUser) {
        ResponseEntity<?> responseEntity = null;
        try {
            boolean isCorrectOTPCode = twilioOTPService.validateOtp(otpValidationRequestDto);
            if (isCorrectOTPCode) {
                var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
                RoleEntity role = roleRepository.findByName("ROLE_SUPPLIER");
                if (role != null) {
                    // user.setRoles(Set.of(role));
                    user.getRoles().add(role);
                    user.setPhoneNumberConfirmed(true);
                    userRepository.save(user);
                    // get new token
                    var jwtToken = jwtService.generateToken(user);

                    tokenHandler.revokeAllUserTokens(user);
                    tokenHandler.saveUserToken(Optional.of(user), jwtToken);

                    LoginResponse authenticationResponse = LoginResponse.builder()
                            .token(jwtToken)
                            .message("Get token successfully!")
                            .build();
                    return new ResponseEntity<>(authenticationResponse, HttpStatus.OK);
                }
                return new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_ROLE_NOT_FOUND), HttpStatus.NOT_FOUND);
            }
            responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_OTP_CODE_INCORRECT), HttpStatus.BAD_REQUEST);

        } catch (Exception ex) {
            responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return responseEntity;
    }
}

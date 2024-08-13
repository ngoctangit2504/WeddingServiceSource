package com.wedding.backend.service.impl.auth;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.common.ModelCommon;
import com.wedding.backend.common.StatusCommon;
import com.wedding.backend.dto.auth.*;
import com.wedding.backend.entity.RoleEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.repository.RoleRepository;
import com.wedding.backend.repository.TokenRepository;
import com.wedding.backend.repository.UserRepository;
import com.wedding.backend.service.IService.auth.IAuthenticationService;
import com.wedding.backend.service.IService.auth.IJWTService;
import com.wedding.backend.service.impl.twilio.TwilioOTPService;
import com.wedding.backend.util.handler.TokenHandler;
import com.wedding.backend.util.helper.HashHelper;
import com.wedding.backend.util.message.MessageUtil;
import com.wedding.backend.util.validator.PhoneNumberValidator;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;


@Service
@RequiredArgsConstructor
public class AuthenticationService implements IAuthenticationService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final IJWTService jwtService;
    private final TokenRepository tokenRepository;
    private final TwilioOTPService twilioOTPService;
    private final TokenHandler tokenHandler;
    private final Map<String, RegisterDTO> registerAccounts = new HashMap<>();

    @Override
    public ResponseEntity<?> register(RegisterDTO request) {
        ResponseEntity<?> response = null;
        try {
            if (!PhoneNumberValidator.isValidPhoneNumber(request.getPhoneNumber())) {
                BaseResult baseResult = new BaseResult(false, MessageUtil.MSG_PHONE_NUMBER_FORMAT_INVALID);
                response = new ResponseEntity<>(baseResult, HttpStatus.BAD_REQUEST);
                return response;
            }

            Optional<UserEntity> existingUser = userRepository.findByPhoneNumber(PhoneNumberValidator.normalizePhoneNumber(request.getPhoneNumber()));

            if (existingUser.isPresent()) {
                BaseResult baseResult = new BaseResult(false, MessageUtil.MSG_PHONE_NUMBER_IS_EXITED);
                response = new ResponseEntity<>(baseResult, HttpStatus.BAD_REQUEST);
                return response;
            }

            if (request.getRole().equals(ModelCommon.CUSTOMER)) {
                boolean checkRegister = this.baseRegister(request);
                if (checkRegister) {
                    BaseResult baseResult = new BaseResult(true, MessageUtil.MSG_REGISTER_SUCCESS);
                    response = new ResponseEntity<>(baseResult, HttpStatus.OK);
                }
            } else if (request.getRole().equals(ModelCommon.MANAGE)) {
                //TODO: Check if other role like manager..
                OTPRequestDto otpRequestDto = createOTPRequest(request);
                ResponseSendOTP responseSendOTP = twilioOTPService.sendSMS(otpRequestDto);
                //TODO: Process when send OTP delivered
                if (responseSendOTP.getStatus().equals(StatusCommon.DELIVERED)) {
                    registerAccounts.put(request.getPhoneNumber(), request);
                    return new ResponseEntity<>(responseSendOTP.getMessage(), HttpStatus.OK);
                } else {
                    return new ResponseEntity<>(responseSendOTP.getMessage(), HttpStatus.BAD_REQUEST);
                }
            }

        } catch (Exception ex) {
            BaseResult baseResult = new BaseResult(false, ex.getMessage());
            response = new ResponseEntity<>(baseResult, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    private OTPRequestDto createOTPRequest(RegisterDTO request) {
        OTPRequestDto otpRequestDto = new OTPRequestDto();
        otpRequestDto.setPhoneNumber(request.getPhoneNumber());
        otpRequestDto.setUserName(request.getUserName());
        return otpRequestDto;
    }

    @Override
    public LoginResponse login(LoginDTO request) {
        // normalize phone number
        String normalizePhoneNumber = PhoneNumberValidator.normalizePhoneNumber(request.getPhoneNumber());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            normalizePhoneNumber,
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException ex) {
            return LoginResponse.error(MessageUtil.MSG_AUTHENTICATION_FAIL);
        }

        var user = userRepository.findByPhoneNumber(normalizePhoneNumber);
        if (user.isPresent()) {
            var jwtToken = jwtService.generateToken(user.get());

            tokenHandler.revokeAllUserTokens(user.get());
            tokenHandler.saveUserToken(user, jwtToken);

            return LoginResponse.builder()
                    .token(jwtToken)
                    .build();
        } else {
            return LoginResponse.error(MessageUtil.MSG_USER_BY_TOKEN_NOT_FOUND);
        }
    }

    @Override
    public ResponseEntity<?> registerTwoFactor(OTPValidationRequestDto requestDto) {
        ResponseEntity<?> response = null;
        try {
            boolean checkValidOTP = twilioOTPService.validateOtp(requestDto);
            if (checkValidOTP) {
                for (Map.Entry<String, RegisterDTO> entry : registerAccounts.entrySet()
                ) {
                    RegisterDTO item = entry.getValue();
                    if (item.getUserName().equals(requestDto.getUserName())) {
                        RegisterDTO request = new RegisterDTO();
                        request.setUserName(item.getUserName());
                        request.setPhoneNumber(item.getPhoneNumber());
                        request.setPassword(item.getPassword());
                        request.setRole(item.getRole());
                        boolean checkRegister = this.baseRegister(request);
                        if (!checkRegister) {
                            BaseResult baseResult = new BaseResult(false, MessageUtil.MSG_REGISTER_FAIL);
                            return new ResponseEntity<>(baseResult, HttpStatus.OK);
                        }
                    }
                }
                BaseResult baseResult = new BaseResult(true, MessageUtil.MSG_OTP_CODE_CORRECT);
                return new ResponseEntity<>(baseResult, HttpStatus.OK);
            } else {
                BaseResult baseResult = new BaseResult(false, MessageUtil.MSG_OTP_CODE_INCORRECT);
                return new ResponseEntity<>(baseResult, HttpStatus.OK);
            }
        } catch (Exception ex) {
            BaseResult baseResult = new BaseResult(false, ex.getMessage());
            response = new ResponseEntity<>(baseResult, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    private boolean baseRegister(RegisterDTO request) {
        RoleEntity role = roleRepository.findByName(request.getRole());
        if (role != null) {
            UserEntity user = new UserEntity();
            user.setId(HashHelper.generateEntityId());
            user.setUserName(request.getUserName());
            user.setBalance(new BigDecimal(0));     // Default balance of user is 0 Vnd
            user.setPhoneNumber(PhoneNumberValidator.normalizePhoneNumber(request.getPhoneNumber()));
            user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
            user.setCreatedBy("");
            user.setCreatedDate(new Date());
            if (request.getRole().equals(ModelCommon.CUSTOMER)) {
                user.setRoles(Set.of(role));
                user.setPhoneNumberConfirmed(false);
                user.setTwoFactorEnable(false);
            } else if (request.getRole().equals(ModelCommon.MANAGE)) {
                RoleEntity responseFromDB = roleRepository.findByName(ModelCommon.CUSTOMER);
                user.setRoles(Set.of(role, responseFromDB));
                user.setPhoneNumberConfirmed(true);
                user.setTwoFactorEnable(true);
            }
            user.setActive(true);
            user.setDeleted(false);
            userRepository.save(user);
            return true;
        } else {
            return false;
        }
    }
}

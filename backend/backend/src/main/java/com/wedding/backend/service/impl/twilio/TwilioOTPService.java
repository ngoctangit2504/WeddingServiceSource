package com.wedding.backend.service.impl.twilio;

import com.twilio.type.PhoneNumber;
import com.wedding.backend.common.StatusCommon;
import com.wedding.backend.config.TwilioConfig;
import com.wedding.backend.dto.auth.OTPRequestDto;
import com.wedding.backend.dto.auth.OTPValidationRequestDto;
import com.wedding.backend.dto.auth.ResponseSendOTP;
import com.wedding.backend.util.message.MessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class TwilioOTPService {
    @Autowired
    private TwilioConfig twilioConfig;

    private final Map<String, String> otpMap = new HashMap<>();

    public ResponseSendOTP sendSMS(OTPRequestDto otpRequest) {
        ResponseSendOTP responseSendOTP = null;
        try {
            PhoneNumber to = new PhoneNumber(otpRequest.getPhoneNumber());//to
            PhoneNumber from = new PhoneNumber(twilioConfig.getTrialNumber()); // from
            String otp = generateOTP();
            String otpMessage = "Kính gửi Quý khách hàng, Mã OTP của bạn là " + otp + " để xác nhận. Cảm ơn bạn.";
            System.out.println(otpMessage);
            // Message message = Message.creator(to, from, otpMessage).create();
            otpMap.put(otpRequest.getUserName(), otp);
            responseSendOTP = new ResponseSendOTP(StatusCommon.DELIVERED, MessageUtil.MSG_SEND_OTP_DELIVERED);
        } catch (Exception e) {
            responseSendOTP = new ResponseSendOTP(StatusCommon.FAILED, MessageUtil.MSG_SEND_OTP_FAILED);
        }
        return responseSendOTP;
    }

    public boolean validateOtp(OTPValidationRequestDto otpValidationRequest) {
        String userName = otpValidationRequest.getUserName();
        String storedOtp = otpMap.get(userName);

        if (storedOtp != null && storedOtp.equals(otpValidationRequest.getOtpNumber())) {
            // OTP is valid
            otpMap.remove(userName);
            return true;
        } else {
            // OTP is invalid
            return false;
        }
    }

    //    generation OTP
    private String generateOTP() {
        return new DecimalFormat("000000")
                .format(new Random().nextInt(999999));
    }
}

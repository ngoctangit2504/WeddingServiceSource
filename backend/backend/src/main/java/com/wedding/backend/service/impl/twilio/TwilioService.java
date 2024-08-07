package com.wedding.backend.service.impl.twilio;

import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import com.wedding.backend.common.StatusCommon;
import com.wedding.backend.config.TwilioConfig;
import com.wedding.backend.service.IService.twilio.ITwilioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;


@Service
public class TwilioService implements ITwilioService {

    @Autowired
    private TwilioConfig twilioConfig;

    @Override
    public ResponseEntity<?> sendSMSNotification(String message, String phoneNumber) {
        ResponseEntity<?> response = null;
        try {
            PhoneNumber to = new PhoneNumber(phoneNumber);//to
            PhoneNumber from = new PhoneNumber(twilioConfig.getTrialNumber()); // from
            Message messaged = Message.creator(to, from, message).create();
            response = new ResponseEntity<>(StatusCommon.DELIVERED, HttpStatus.OK);
        } catch (Exception e) {
            response = new ResponseEntity<>(StatusCommon.FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
}

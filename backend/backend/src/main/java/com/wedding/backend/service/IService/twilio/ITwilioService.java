package com.wedding.backend.service.IService.twilio;

import org.springframework.http.ResponseEntity;

public interface ITwilioService {
    ResponseEntity<?> sendSMSNotification(String message, String phoneNumber);
}

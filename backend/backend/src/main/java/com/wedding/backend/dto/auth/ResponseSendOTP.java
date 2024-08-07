package com.wedding.backend.dto.auth;

import com.wedding.backend.common.StatusCommon;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResponseSendOTP {
    private StatusCommon status;
    private String message;
}

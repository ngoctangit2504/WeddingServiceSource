package com.wedding.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginDTO {
    private String phoneNumber;
    private String password;
}

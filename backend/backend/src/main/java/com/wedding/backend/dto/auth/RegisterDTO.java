package com.wedding.backend.dto.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDTO {
    private String userName;
    private String phoneNumber;
    private String password;
    private String role;
}

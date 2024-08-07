package com.wedding.backend.dto.user;

import com.wedding.backend.entity.RoleEntity;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
public class UserDTO {
    private String customerId;
    private String userName;
    private String email;
    private String profileImage;
    private String phoneNumber;
    private boolean phoneNumberConfirmed;
    private boolean twoFactorEnable;
    private boolean isActive;
    private boolean isDeleted;
    private Date dateOfBirth;
    private String address;
    private BigDecimal balance;
    private String createdBy;
    private String modifiedBy;
    private Date createdDate;
    private Date modifiedDate;
    private Set<RoleEntity> roles = new HashSet<>();
}

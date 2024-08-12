package com.wedding.backend.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatus {
    private Long totalAccount;
    private Long percentUser;
    private Long totalUser;
    private Long percentManage;
    private Long totalManage;
}

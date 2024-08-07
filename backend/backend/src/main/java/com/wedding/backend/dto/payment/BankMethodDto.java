package com.wedding.backend.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BankMethodDto {

    private Long bankMethodId;

    private String bankName;

    private String bankAccount;
}
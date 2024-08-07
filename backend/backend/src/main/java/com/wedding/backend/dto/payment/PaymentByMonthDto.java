package com.wedding.backend.dto.payment;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class PaymentByMonthDto {
    private Integer month;
    private BigDecimal total;
}

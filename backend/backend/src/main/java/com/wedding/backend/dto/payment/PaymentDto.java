package com.wedding.backend.dto.payment;

import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

@Data
public class PaymentDto {
    private String paymentContent = "";
    private String paymentCurrency = "vnd";
    private String paymentRefId = "ROD001";
    private BigDecimal requiredAmount;
    private Date paymentDate = new Date();
    private Date expireDate = new Date(System.currentTimeMillis() + 15 * 60 * 1000); // 15 minutes in the future
    private String paymentLanguage = "vn";
    private String merchantId = "92ddc03d7cfc4a58bf5768e545fa8249";
    private String paymentDestinationId = "";
    private String signature = "";
}

package com.wedding.backend.service.IService.payment;

import com.wedding.backend.dto.merchant.MerchantDto;
import org.springframework.http.ResponseEntity;

public interface IMerchantService {
    ResponseEntity<?> addMerchant(MerchantDto request);

    ResponseEntity<?> getAllMerchant();
}

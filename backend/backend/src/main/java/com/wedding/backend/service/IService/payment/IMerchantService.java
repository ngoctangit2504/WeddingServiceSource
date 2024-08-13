package com.wedding.backend.service.IService.payment;

import org.springframework.http.ResponseEntity;

public interface IMerchantService {
    ResponseEntity<?> addMerchant(MerchantDto request);

    ResponseEntity<?> getAllMerchant();
}

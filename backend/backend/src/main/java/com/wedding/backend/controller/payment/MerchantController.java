package com.wedding.backend.controller.payment;

import com.wedding.backend.dto.merchant.MerchantDto;
import com.wedding.backend.service.IService.payment.IMerchantService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/api/v1/merchant")
@RequiredArgsConstructor
public class MerchantController {

    private final IMerchantService merchantService;

    @PostMapping()
    public ResponseEntity<?> addMerchant(@RequestBody MerchantDto request) {
        return merchantService.addMerchant(request);
    }

    @GetMapping
    public ResponseEntity<?> getAllMerchant() {
        return merchantService.getAllMerchant();
    }
}

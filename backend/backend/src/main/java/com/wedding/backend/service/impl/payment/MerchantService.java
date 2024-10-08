package com.wedding.backend.service.impl.payment;


import com.wedding.backend.dto.merchant.MerchantDto;
import com.wedding.backend.repository.payment.MerchantRepository;
import com.wedding.backend.service.IService.payment.IMerchantService;
import com.wedding.backend.util.helper.HashHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.wedding.backend.entity.MerchantEntity;

import java.util.List;

@Service
public class MerchantService implements IMerchantService {
    @Autowired
    private MerchantRepository merchantRepository;
    @Override
    public ResponseEntity<?> addMerchant(MerchantDto request) {
        ResponseEntity<?> response = null;

        try {
            MerchantEntity merchant = new MerchantEntity();
            merchant.setId(HashHelper.generateEntityId());
            merchant.setMerchantName(request.getMerchantName());
            merchant.setMerchantWebLink(request.getMerchantWebLink());
            merchant.setMerchantIpnUrl(request.getMerchantIpnUrl());
            merchant.setMerchantReturnUrl(request.getMerchantReturnUrl());

            merchant = merchantRepository.save(merchant);
            response = new ResponseEntity<>(merchant, HttpStatus.OK);

        }catch (Exception ex){
            response = new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> getAllMerchant() {
        ResponseEntity<?> response = null;
        try {
            List<MerchantEntity> merchant = merchantRepository.findAll();
            response = new ResponseEntity<>(merchant, HttpStatus.OK);

        }catch (Exception ex){
            response = new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
}

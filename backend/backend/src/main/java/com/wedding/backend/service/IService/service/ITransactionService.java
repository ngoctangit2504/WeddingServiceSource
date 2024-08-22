package com.wedding.backend.service.IService.service;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.security.Principal;

public interface ITransactionService {
    ResponseEntity<?> purchasePackageByUser(Principal connectedUser, Long servicePackageId);

    ResponseEntity<?> purchasedServiceByUser();

    ResponseEntity<?> getAllTransactionServiceByUser(Principal connectedUser, Pageable pageable);

    ResponseEntity<?> getAllTransactionService(Pageable pageable);

    ResponseEntity<?> checkTransactionServicePackageIsExpired(Principal connectedUser);
}

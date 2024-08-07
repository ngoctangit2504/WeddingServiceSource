package com.wedding.backend.repository.payment;

import com.wedding.backend.entity.PaymentSignatureEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentSignatureRepository extends JpaRepository<PaymentSignatureEntity, String> {
}

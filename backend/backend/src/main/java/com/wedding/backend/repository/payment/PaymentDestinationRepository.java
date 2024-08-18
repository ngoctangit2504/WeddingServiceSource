package com.wedding.backend.repository.payment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentDestinationRepository extends JpaRepository<PaymentDestinationEntity, String> {
}

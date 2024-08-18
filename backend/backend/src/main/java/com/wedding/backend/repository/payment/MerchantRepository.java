package com.wedding.backend.repository.payment;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface MerchantRepository extends JpaRepository<MerchantEntity, String> {
}

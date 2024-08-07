package com.wedding.backend.repository.payment;

import com.wedding.backend.entity.MerchantEntity;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface MerchantRepository extends JpaRepository<MerchantEntity, String> {
}

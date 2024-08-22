package com.wedding.backend.repository;

import com.wedding.backend.entity.SupplierFollowEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SupplierFollowRepository extends JpaRepository<SupplierFollowEntity, Long> {
    Optional<SupplierFollowEntity> findByUser_IdAndSupplierFollow_id(String userId, Long supplierId);
}

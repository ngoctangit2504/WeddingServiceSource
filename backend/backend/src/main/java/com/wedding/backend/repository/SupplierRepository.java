package com.wedding.backend.repository;

import com.wedding.backend.entity.SupplierEntity;
import com.wedding.backend.entity.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface SupplierRepository extends JpaRepository<SupplierEntity, Long> {
    Optional<SupplierEntity> findByPhoneNumberSupplier(String phoneNumber);

    Optional<SupplierEntity> findByEmailSupplier(String email);

    List<SupplierEntity> findAllByUser(UserEntity email);

    List<SupplierEntity> findAllByIsDeletedFalse(Pageable pageable);

    Optional<SupplierEntity> findByUser_Id(String userId);
}

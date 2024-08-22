package com.wedding.backend.repository;

import com.wedding.backend.dto.supplier.ServiceLimitResponse;
import com.wedding.backend.entity.SupplierEntity;
import com.wedding.backend.entity.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    @Query(value = "Select supplier.id as supplierId , service_limit as serviceLimit from supplier \n" +
            "inner join transaction on supplier.id = transaction.supplier_id\n" +
            "inner join service_package on transaction.package_id = service_package.id \n" +
            "where supplier.id =:supplierId and transaction.expired = false", nativeQuery = true)
    ServiceLimitResponse getServiceLimitOfPackageVIP(@Param("supplierId") Long supplierId);

}

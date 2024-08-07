package com.wedding.backend.repository;

import com.wedding.backend.entity.ServiceTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceTypeEntity, Long> {
    ServiceTypeEntity findByName(String typeName);
}

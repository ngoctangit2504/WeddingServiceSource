package com.wedding.backend.service.IService.service;

import com.wedding.backend.dto.servicePackage.ServicePackageDto;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface IServicePackage {
    ResponseEntity<?> addServicePackage(ServicePackageDto request);

    ResponseEntity<?> updateServicePackage(Long servicePackageId, ServicePackageDto request);

    ResponseEntity<?> removeServicePackageById(Long servicePackageId);

    ResponseEntity<?> getAllServicePackage(Pageable pageable);

}

package com.wedding.backend.service.IService.service;

import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.service.ServiceTypeDTO;
import com.wedding.backend.dto.supplier.ServiceTypeBySupplier;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IServiceType {
    BaseResultWithDataAndCount<List<ServiceTypeDTO>> getAllServiceType();

    BaseResultWithData<List<ServiceTypeBySupplier>> serviceTypeNameBySupplier(Long supplierId);

    ResponseEntity<?> upsertServiceType();
}

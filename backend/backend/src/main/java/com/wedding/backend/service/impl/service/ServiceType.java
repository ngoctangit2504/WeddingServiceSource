package com.wedding.backend.service.impl.service;

import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.service.ServiceTypeDTO;
import com.wedding.backend.dto.supplier.ServiceTypeBySupplier;
import com.wedding.backend.exception.ResourceNotFoundException;
import com.wedding.backend.mapper.ServiceTypeMapper;
import com.wedding.backend.repository.ServiceTypeRepository;
import com.wedding.backend.service.IService.service.IServiceType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ServiceType implements IServiceType {

    private final ServiceTypeRepository serviceTypeRepository;
    private final ServiceTypeMapper mapper;

    @Override
    public BaseResultWithDataAndCount<List<ServiceTypeDTO>> getAllServiceType() {
        BaseResultWithDataAndCount<List<ServiceTypeDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            List<ServiceTypeDTO> responseFromDb = serviceTypeRepository.findAll()
                    .stream()
                    .map(serviceTypeEntity -> mapper.entityToDto(serviceTypeEntity))
                    .toList();
            Long countAllResultServiceType = serviceTypeRepository.count();
            result.set(responseFromDb, countAllResultServiceType);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResultWithData<List<ServiceTypeBySupplier>> serviceTypeNameBySupplier(Long supplierId) {
        BaseResultWithData<List<ServiceTypeBySupplier>> result = new BaseResultWithData<>();
        try {
            List<ServiceTypeBySupplier> dataFromDb = serviceTypeRepository.serviceTypeNameBySupplier(supplierId);
            result.Set(true, "", dataFromDb);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public ResponseEntity<?> upsertServiceType() {
        return null;
    }
}

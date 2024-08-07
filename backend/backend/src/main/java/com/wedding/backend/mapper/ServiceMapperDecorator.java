package com.wedding.backend.mapper;

import com.wedding.backend.dto.service.ServiceDTO;
import com.wedding.backend.entity.ServiceEntity;
import com.wedding.backend.repository.ServiceTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public abstract class ServiceMapperDecorator implements ServiceMapper {

    @Autowired
    @Qualifier("delegate")
    private ServiceMapper delegate;

    @Autowired
    private ServiceTypeRepository repository;

    @Override
    public ServiceDTO entityToDto(ServiceEntity serviceEntity) {
        ServiceDTO serviceDTO = delegate.entityToDto(serviceEntity);
        serviceDTO.setStatus(serviceEntity.getStatus().name());
        return serviceDTO;
    }
}

package com.wedding.backend.mapper;


import com.wedding.backend.dto.service.ServiceDTO;
import com.wedding.backend.entity.ServiceEntity;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
@DecoratedWith(ServiceMapperDecorator.class)
public interface ServiceMapper {
    ServiceDTO entityToDto(ServiceEntity serviceEntity);
    ServiceEntity dtoToEntity(ServiceDTO serviceDTO);
}

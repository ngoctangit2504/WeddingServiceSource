package com.wedding.backend.mapper;


import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
@DecoratedWith(ServiceMapperDecorator.class)
public interface ServiceMapper {
    ServiceDTO entityToDto(ServiceEntity serviceEntity);
    ServiceEntity dtoToEntity(ServiceDTO serviceDTO);
}

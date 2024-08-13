package com.wedding.backend.mapper;

import com.wedding.backend.dto.service.ServiceTypeDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ServiceTypeMapper {
    ServiceTypeEntity dtoToEntity(ServiceTypeDTO serviceTypeDTO);

    ServiceTypeDTO entityToDto(ServiceTypeEntity serviceTypeEntity);

}

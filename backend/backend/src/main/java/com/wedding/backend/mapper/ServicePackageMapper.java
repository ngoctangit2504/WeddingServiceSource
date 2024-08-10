package com.wedding.backend.mapper;


import com.wedding.backend.dto.servicePackage.ServicePackageDto;
import com.wedding.backend.entity.ServicePackageEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ServicePackageMapper {

    @Mapping(target = "servicePackageId", source = "id")
    ServicePackageDto entityToDto(ServicePackageEntity servicePackage);

    @Mapping(target = "id", source = "servicePackageId")
    ServicePackageEntity dtoToEntity(ServicePackageDto servicePackageDto);
}

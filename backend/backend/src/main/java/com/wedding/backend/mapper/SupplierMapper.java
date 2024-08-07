package com.wedding.backend.mapper;

import com.wedding.backend.dto.supplier.SupplierDTO;
import com.wedding.backend.entity.SupplierEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SupplierMapper {
    SupplierEntity dtoToEntity(SupplierDTO supplierDTO);

    SupplierDTO entityToDto(SupplierEntity supplierEntity);
}

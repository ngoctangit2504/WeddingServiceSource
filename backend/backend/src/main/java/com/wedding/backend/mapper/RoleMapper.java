package com.wedding.backend.mapper;


import com.wedding.backend.dto.auth.RoleDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleDTO entityToDto(RoleEntity roleEntity);

    RoleEntity dtoToEntity(RoleDTO roleDTO);
}

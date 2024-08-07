package com.wedding.backend.mapper;

import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.dto.user.UserDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mappings({
            @Mapping(target = "customerId", source = "id")

    })
    UserDTO entityToDto(UserEntity userEntity);

    @Mappings({
            @Mapping(target = "id", source = "customerId")
    })
    UserEntity DtoToEntity(UserDTO userDTO);
}

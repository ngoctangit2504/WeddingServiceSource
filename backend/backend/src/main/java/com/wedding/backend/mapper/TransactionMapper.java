package com.wedding.backend.mapper;

import com.wedding.backend.dto.transaction.TransactionDto;
import com.wedding.backend.entity.TransactionEntity;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
@DecoratedWith(TransactionMapperDecorator.class)
public interface TransactionMapper {
    @Mapping(target = "transactionId", source = "id")
    TransactionDto entityToDto(TransactionEntity transaction);
}

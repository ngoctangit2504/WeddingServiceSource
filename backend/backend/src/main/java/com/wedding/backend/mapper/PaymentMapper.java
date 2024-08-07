package com.wedding.backend.mapper;

import com.wedding.backend.dto.payment.PaymentDtoMapper;
import com.wedding.backend.entity.PaymentEntity;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
@DecoratedWith(PaymentMapperDecorator.class)
public interface PaymentMapper {
    PaymentDtoMapper entityToDto(PaymentEntity paymentEntity);
}

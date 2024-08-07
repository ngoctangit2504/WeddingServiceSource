package com.wedding.backend.mapper;


import com.wedding.backend.dto.payment.PaymentDtoMapper;
import com.wedding.backend.entity.PaymentEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.Optional;

public abstract class PaymentMapperDecorator implements PaymentMapper {

    @Autowired
    @Qualifier("delegate")
    private PaymentMapper delegate;

    @Autowired
    private UserRepository userRepository;

    @Override
    public PaymentDtoMapper entityToDto(PaymentEntity paymentEntity) {
        PaymentDtoMapper paymentDtoMapper = delegate.entityToDto(paymentEntity);
        paymentDtoMapper.setPaymentDestinationsName(paymentEntity.getPaymentDestinations().getId());
        Optional<UserEntity> userEntity = userRepository.findById(paymentEntity.getUserPayment().getId());
        userEntity.ifPresent(entity -> paymentDtoMapper.setPhoneNumberUser(entity.getPhoneNumber()));
        return paymentDtoMapper;
    }
}

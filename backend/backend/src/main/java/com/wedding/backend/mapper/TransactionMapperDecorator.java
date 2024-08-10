package com.wedding.backend.mapper;


import com.wedding.backend.dto.servicePackage.PartServicePackage;
import com.wedding.backend.dto.supplier.PartSupplier;
import com.wedding.backend.dto.transaction.TransactionDto;
import com.wedding.backend.entity.ServicePackageEntity;
import com.wedding.backend.entity.SupplierEntity;
import com.wedding.backend.entity.TransactionEntity;
import com.wedding.backend.repository.ServicePackageRepository;
import com.wedding.backend.repository.SupplierRepository;
import com.wedding.backend.util.validator.PhoneNumberValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

import java.util.Optional;

public abstract class TransactionMapperDecorator implements TransactionMapper {
    @Autowired
    @Qualifier("delegate")
    private TransactionMapper delegate;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ServicePackageRepository servicePackageRepository;

    @Override
    public TransactionDto entityToDto(TransactionEntity transaction) {
        TransactionDto transactionDto = delegate.entityToDto(transaction);
        Optional<SupplierEntity> user = supplierRepository.findById(transaction.getUserTransaction().getId());
        Optional<ServicePackageEntity> servicePackage = servicePackageRepository.findById(transaction.getServicePackage().getId());
        if (user.isPresent()) {
            PartSupplier partUser = PartSupplier.builder()
                    .supplierId(user.get().getId())
                    .userName(user.get().getName())
                    .phoneNumber(PhoneNumberValidator.normalizeDisplayPhoneNumber(user.get().getPhoneNumberSupplier()))
                    .images(user.get().getLogo())
                    .build();
            transactionDto.setPartSupplier(partUser);
        }
        if(servicePackage.isPresent()){
            PartServicePackage partServicePackage = PartServicePackage.builder()
                    .servicePackageId(servicePackage.get().getId())
                    .servicePackageName(servicePackage.get().getName())
                    .durationDays(servicePackage.get().getDurationDays())
                    .price(servicePackage.get().getPrice())
                    .createdDate(servicePackage.get().getCreatedDate())
                    .build();
            transactionDto.setPartServicePackage(partServicePackage);
        }
        return transactionDto;
    }
}

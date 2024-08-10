package com.wedding.backend.mapper;

import com.wedding.backend.dto.user.UserDTO;
import com.wedding.backend.entity.RoleEntity;
import com.wedding.backend.entity.TransactionEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.repository.RoleRepository;
import com.wedding.backend.service.IService.service.ITransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

public abstract class UserMapperDecorator implements UserMapper {
    @Autowired
    @Qualifier("delegate")
    private UserMapper delegate;

    @Autowired
    ITransactionService transactionService;

    @Override
    public UserDTO entityToDto(UserEntity userEntity) {
        UserDTO userDTO = delegate.entityToDto(userEntity);
        userDTO.setPhoneNumber(userEntity.getPhoneNumber());
        Set<RoleEntity> roleDTOList = userEntity.getRoles();
        userDTO.setRoles(roleDTOList);
        ResponseEntity<?> response = transactionService.purchasedServiceByUser();
        if(response.getStatusCode().is2xxSuccessful()){
            TransactionEntity transaction = (TransactionEntity)response.getBody();
            if(transaction != null){
                userDTO.setServicePackageUsed(transaction.getServicePackage().getName());
            }
        }
        return userDTO;
    }
}

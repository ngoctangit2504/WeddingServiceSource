package com.wedding.backend.service.impl.service;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.common.StatusCommon;
import com.wedding.backend.dto.transaction.TransactionDto;
import com.wedding.backend.entity.ServicePackageEntity;
import com.wedding.backend.entity.SupplierEntity;
import com.wedding.backend.entity.TransactionEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.mapper.TransactionMapper;
import com.wedding.backend.repository.ServicePackageRepository;
import com.wedding.backend.repository.SupplierRepository;
import com.wedding.backend.repository.TransactionRepository;
import com.wedding.backend.repository.UserRepository;
import com.wedding.backend.service.IService.service.ITransactionService;
import com.wedding.backend.service.IService.twilio.ITwilioService;
import com.wedding.backend.util.helper.HashHelper;
import com.wedding.backend.util.message.MessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.security.Principal;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TransactionServiceImpl implements ITransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ServicePackageRepository servicePackageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ITwilioService twilioService;

    @Autowired
    private TransactionMapper transactionMapper;

    @Override
    public ResponseEntity<?> purchasePackageByUser(Principal connectedUser, Long servicePackageId) {
        ResponseEntity<?> response = null;
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

            if (user != null) {
                Optional<SupplierEntity> supplier = supplierRepository.findByUser_Id(user.getId());
                if (supplier.isPresent()) {
                    Optional<ServicePackageEntity> servicePackageEntity = servicePackageRepository.findById(servicePackageId);
                    if (servicePackageEntity.isPresent()) {
                        //TODO: CHECK Balance Of User > service package price
                        if (user.getBalance().compareTo(servicePackageEntity.get().getPrice()) >= 0) {
                            //TODO: Extension service package if user have before and expirationDate > now
                            Optional<TransactionEntity> transactionEntity = transactionRepository.findByUserTransaction_IdAndExpiredFalse(supplier.get().getId());
                            if (transactionEntity.isPresent() && transactionEntity.get().getExpirationDate().after(new Date())) {
                                Instant instant = transactionEntity.get().getExpirationDate().toInstant();
                                LocalDateTime expirationDate = LocalDateTime.ofInstant(instant, ZoneId.systemDefault()).plusDays(servicePackageEntity.get().getDurationDays());
                                transactionEntity.get().setExpirationDate(Date.from(expirationDate.atZone(ZoneId.systemDefault()).toInstant()));

                                //Số ngày gia hạn
                                Integer newExtensionDays = transactionEntity.get().getExtensionDays() + servicePackageEntity.get().getDurationDays();
                                transactionEntity.get().setExtensionDays(newExtensionDays);

                                transactionEntity.get().setServicePackage(servicePackageEntity.get());

                                transactionRepository.save(transactionEntity.get());

                                //TODO: Minus balance of user
                                BigDecimal newBalance = user.getBalance().subtract(servicePackageEntity.get().getPrice());
                                user.setBalance(newBalance);
                                userRepository.save(user);
                                //TODO: Send Message To PhoneNumber

                                ResponseEntity<?> responseEntity = twilioService.sendSMSNotification(
                                        "Cảm ơn bạn đã gia hạn đăng kí dịch vụ đăng tin ở Sweet Dream với gọi dịch vụ đã đăng kí: "
                                                + servicePackageEntity.get().getName()
                                                + " Trong vòng: "
                                                + servicePackageEntity.get().getDurationDays()
                                                + " Ngày. Từ ngày: "
                                                + dateFormat.format(transactionEntity.get().getPurchaseDate())
                                                + " Đến Hết Ngày: "
                                                + dateFormat.format(transactionEntity.get().getExpirationDate())
                                        , user.getPhoneNumber());
                                if (responseEntity != null && responseEntity.getBody() != null) {
                                    if (responseEntity.getBody().equals(StatusCommon.DELIVERED)) {
                                        return new ResponseEntity<>(new BaseResult(true, MessageUtil.MSG_TRANSACTION_EXTENSION_SERVICE_SUCCESS_WITH_SMS + ": " + servicePackageEntity.get().getName()), HttpStatus.OK);
                                    }
                                }
                                return new ResponseEntity<>(new BaseResult(true, MessageUtil.MSG_TRANSACTION_EXTENSION_SERVICE_SUCCESS_WITHOUT_SMS + ": " + servicePackageEntity.get().getName()), HttpStatus.OK);
                            } else {

                                //TODO: Insert To Transaction Table
                                TransactionEntity transactionInsert = new TransactionEntity();
                                transactionInsert.setId((long) HashHelper.generateRandomNumbers());
                                transactionInsert.setPurchaseDate(new Date());
                                // ExpirationDate = now + duration_data
                                Instant instant = Instant.now();
                                LocalDateTime expirationDate = LocalDateTime.ofInstant(instant, ZoneId.systemDefault()).plusDays(servicePackageEntity.get().getDurationDays());
                                transactionInsert.setExpirationDate(Date.from(expirationDate.atZone(ZoneId.systemDefault()).toInstant()));


                                transactionInsert.setExtensionDays(0);

                                transactionInsert.setExpired(false);

                                //TODO: get supplier by user

                                transactionInsert.setUserTransaction(supplier.get());

                                transactionInsert.setServicePackage(servicePackageEntity.get());

                                transactionRepository.save(transactionInsert);

                                //TODO: Minus balance of user
                                BigDecimal newBalance = user.getBalance().subtract(servicePackageEntity.get().getPrice());
                                user.setBalance(newBalance);

                                //TODO: Up role user to ROLE_UTIL_MANAGE --> REMOVE
//                            Optional<RoleEntity> role = Optional.of(roleRepository.findByName(ModelCommon.ULTI_MANAGER));
//                            if (role.isPresent()) {
//                                user.getRoles().add(role.get());
//                                userRepository.save(user);
//                            } else {
//                                return response = new ResponseEntity<>(BaseResponse.error(MessageUtil.MSG_ROLE_NOT_FOUND), HttpStatus.NOT_FOUND);
//                            }

                                //TODO: Send Message To PhoneNumber
                                ResponseEntity<?> responseEntity = twilioService.sendSMSNotification(
                                        "Cảm ơn bạn đã đăng kí dịch vụ đăng tin ở Sweet Dream với gọi dịch vụ đã đăng kí: "
                                                + servicePackageEntity.get().getName()
                                                + " Trong vòng: "
                                                + servicePackageEntity.get().getDurationDays()
                                                + " Ngày. Từ ngày: "
                                                + dateFormat.format(transactionInsert.getPurchaseDate())
                                                + " Đến Hết Ngày: "
                                                + dateFormat.format(transactionInsert.getExpirationDate())
                                        , user.getPhoneNumber());
                                if (responseEntity != null && responseEntity.getBody() != null) {
                                    if (responseEntity.getBody().equals(StatusCommon.DELIVERED)) {
                                        return response = new ResponseEntity<>(new BaseResult(true, MessageUtil.MSG_TRANSACTION_SERVICE_SUCCESS_WITH_SMS + ": " + servicePackageEntity.get().getName()), HttpStatus.OK);
                                    }
                                }
                                response = new ResponseEntity<>(new BaseResult(true, MessageUtil.MSG_TRANSACTION_SERVICE_SUCCESS_WITHOUT_SMS + ": " + servicePackageEntity.get().getName()), HttpStatus.OK);
                            }
                        } else {
                            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_BALANCE_NOT_ENOUGH), HttpStatus.BAD_REQUEST);
                        }
                    } else {
                        response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SERVICE_NOT_FOUND), HttpStatus.NOT_FOUND);
                    }
                } else {
                    response = new ResponseEntity<>(new BaseResult(false, MessageUtil.SUPPLIER_NOT_FOUND), HttpStatus.NOT_FOUND);
                }
            } else {
                response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_USER_BY_TOKEN_NOT_FOUND), HttpStatus.NOT_FOUND);
            }

        } catch (Exception ex) {
            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> purchasedServiceByUser() {
        ResponseEntity<?> response = null;
        try {
            String userId = null;
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            Object principal = authentication.getPrincipal();
            if (principal instanceof UserEntity) {
                userId = ((UserEntity) principal).getId();
            }
            if (userId != null) {
                Optional<SupplierEntity> supplier = supplierRepository.findByUser_Id(userId);
                if (supplier.isPresent()) {
                    Optional<TransactionEntity> transaction = transactionRepository.findByUserTransaction_IdAndExpiredFalse(supplier.get().getId());
                    if (transaction.isPresent()) {
                        response = new ResponseEntity<>(transaction.get(), HttpStatus.OK);
                    } else {
                        response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SERVICE_NOT_FOUND), HttpStatus.NOT_FOUND);
                    }
                } else {
                    response = new ResponseEntity<>(new BaseResult(false, MessageUtil.SUPPLIER_NOT_FOUND), HttpStatus.NOT_FOUND);
                }
            } else {
                response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_USER_BY_TOKEN_NOT_FOUND), HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> getAllTransactionServiceByUser(Principal connectedUser, Pageable pageable) {
        ResponseEntity<?> response = null;
        BaseResultWithDataAndCount<List<TransactionDto>> resultWithDataAndCount = new BaseResultWithDataAndCount<>();
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            if (user != null) {
                Optional<SupplierEntity> supplier = supplierRepository.findByUser_Id(user.getId());
                if (supplier.isPresent()) {
                    List<TransactionDto> transactionDtos = transactionRepository.findByUserTransactionIdOrderByPurchaseDateDesc(supplier.get().getId(), pageable)
                            .stream()
                            .map(transaction -> transactionMapper.entityToDto(transaction))
                            .collect(Collectors.toList());
                    resultWithDataAndCount.set(transactionDtos, (long) transactionDtos.size());
                    return new ResponseEntity<>(resultWithDataAndCount, HttpStatus.OK);
                }
                response = new ResponseEntity<>(new BaseResult(false, MessageUtil.SUPPLIER_NOT_FOUND), HttpStatus.NOT_FOUND);
            }
        } catch (Exception ex) {
            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> getAllTransactionService(Pageable pageable) {
        ResponseEntity<?> response = null;
        BaseResultWithDataAndCount<List<TransactionDto>> baseResultWithDataAndCount = new BaseResultWithDataAndCount<>();
        try {
            List<TransactionDto> transactionDtos = transactionRepository.findAllByOrderByPurchaseDateDesc(pageable)
                    .stream()
                    .map(transaction -> transactionMapper.entityToDto(transaction))
                    .collect(Collectors.toList());
            Long count = transactionRepository.count();
            baseResultWithDataAndCount.set(transactionDtos, count);
            response = new ResponseEntity<>(baseResultWithDataAndCount, HttpStatus.OK);
        } catch (Exception ex) {
            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
}

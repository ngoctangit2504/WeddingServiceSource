package com.wedding.backend.service.impl.supplier;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.supplier.SupplierDTO;
import com.wedding.backend.dto.supplier.UpdateSupplierRequest;
import com.wedding.backend.entity.SupplierEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.exception.ResourceNotFoundException;
import com.wedding.backend.mapper.SupplierMapper;
import com.wedding.backend.repository.SupplierRepository;
import com.wedding.backend.service.IService.supplier.ISupplierService;
import com.wedding.backend.util.handler.FileHandler;
import com.wedding.backend.util.message.MessageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SupplierService implements ISupplierService {
    private final SupplierRepository repository;
    private final FileHandler fileHandler;
    private final SupplierMapper supplierMapper;


    @Override
    public BaseResultWithData<SupplierDTO> getSupplier(Long supplierId) {
        BaseResultWithData<SupplierDTO> result = new BaseResultWithData<>();
        try {
            Optional<SupplierEntity> supplier = repository.findById(supplierId);
            if (supplier.isPresent()) {
                result.Set(true, MessageUtil.MSG_SUCCESS, supplierMapper.entityToDto(supplier.get()));
            }else {
                result.Set(false, MessageUtil.SUPPLIER_NOT_FOUND, null);
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResultWithData<SupplierDTO> updateSupplier(UpdateSupplierRequest supplier, MultipartFile supplierImage, Principal connectedUser) {
        return null;
    }

    @Override
    public BaseResult addSupplier(SupplierDTO request, MultipartFile supplierImage, Principal connectedUser) {
        BaseResult result = new BaseResult();
        try {
            var userEntity = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            SupplierEntity supplier;

            // Kiểm tra xem có id trong request không
            if (request.getId() != null) {
                // Tìm nhà cung cấp trong DB theo id
                var supplierFromDB = repository.findById(request.getId());
                if (supplierFromDB.isPresent()) {
                    supplier = supplierFromDB.get();
                } else {
                    result.setSuccess(false);
                    result.setMessage(MessageUtil.SUPPLIER_NOT_FOUND);
                    return result;
                }
            } else {
                // Thêm mới nhà cung cấp
                supplier = new SupplierEntity();
                supplier.setUser(userEntity);
                supplier.setCreatedBy(userEntity.getId());
                supplier.setCreatedDate(new Date());
            }

            // Kiểm tra số điện thoại nếu có
            if (request.getPhoneNumberSupplier() != null) {
                var supplierWithPhone = repository.findByPhoneNumberSupplier(request.getPhoneNumberSupplier());
                if (supplierWithPhone.isPresent() && !supplierWithPhone.get().getId().equals(request.getId())) {
                    result.setSuccess(false);
                    result.setMessage(MessageUtil.MSG_PHONE_NUMBER_IS_EXITED);
                    return result;
                }
                supplier.setPhoneNumberSupplier(request.getPhoneNumberSupplier());
            }

            // Kiểm tra email nếu có
            if (request.getEmailSupplier() != null) {
                var supplierWithEmail = repository.findByEmailSupplier(request.getEmailSupplier());
                if (supplierWithEmail.isPresent() && !supplierWithEmail.get().getId().equals(request.getId())) {
                    result.setSuccess(false);
                    result.setMessage(MessageUtil.MSG_EMAIL_IS_EXITED);
                    return result;
                }
                supplier.setEmailSupplier(request.getEmailSupplier());
            }

            if (request.getName() != null) {
                supplier.setName(request.getName());
            }

            if (request.getAddressSupplier() != null) {
                supplier.setAddressSupplier(request.getAddressSupplier());
            }

            if (supplierImage != null) {
                supplier.setLogo(fileHandler.getFileUrls(supplierImage));
            }

            SupplierEntity resultFromDb = repository.save(supplier);
            result.setSuccess(true);
            result.setMessage(request.getId() != null ? MessageUtil.MSG_UPDATE_SUCCESS : MessageUtil.MSG_ADD_SUCCESS);
        } catch (Exception ex) {
            result.setSuccess(false);
            result.setMessage(ex.getMessage());
            return result;
        }
        return result;
    }


    @Override
    public BaseResultWithDataAndCount<List<SupplierDTO>> getSupplierByUser(Principal connectedUser) {
        BaseResultWithDataAndCount<List<SupplierDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            List<SupplierDTO> resultFromDB = repository.findAllByUser(user)
                    .stream()
                    .map(supplierEntity -> supplierMapper.entityToDto(supplierEntity))
                    .toList();
            result.setData(resultFromDB);
            result.setCount((long) resultFromDB.size());
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResultWithDataAndCount<List<SupplierDTO>> getSuppliersByFalseDeleted(Pageable pageable) {
        BaseResultWithDataAndCount<List<SupplierDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            List<SupplierDTO> resultFromDB = repository.findAllByIsDeletedFalse(pageable)
                    .stream()
                    .map(supplierMapper::entityToDto)
                    .toList();
            result.set(resultFromDB, (long) resultFromDB.size());
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResult checkSupplierExitByUserId(Principal connectedUser) {
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            Optional<SupplierEntity> dataFromDb = repository.findByUser_Id(user.getId());
            if (dataFromDb.isPresent()) {
                return new BaseResult(true, "Supplier is exited!");
            }
            return new BaseResult(false, "Supplier is not found!");
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }
}

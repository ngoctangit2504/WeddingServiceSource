package com.wedding.backend.service.IService.supplier;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.supplier.SupplierDTO;
import com.wedding.backend.dto.supplier.UpdateSupplierRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

public interface ISupplierService {

    BaseResultWithData<SupplierDTO> getSupplier(Long supplierId);

    BaseResultWithData<SupplierDTO> updateSupplier(UpdateSupplierRequest supplier, MultipartFile supplierImage, Principal connectedUser);

    BaseResult addSupplier(SupplierDTO request, MultipartFile supplierImage, Principal connectedUser);

    BaseResultWithDataAndCount<List<SupplierDTO>> getSupplierByUser(Principal connectedUser);

    BaseResultWithDataAndCount<List<SupplierDTO>> getSuppliersByFalseDeleted(Pageable pageable);

    BaseResult checkSupplierExitByUserId(Principal connectedUser);
}

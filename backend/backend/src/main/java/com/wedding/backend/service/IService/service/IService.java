package com.wedding.backend.service.IService.service;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.service.ImageAlbDTOConvert;
import com.wedding.backend.dto.service.ServiceDTO;
import com.wedding.backend.dto.service.ServiceDetail;
import com.wedding.backend.dto.service.UpSertServiceDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

public interface IService {
    BaseResultWithDataAndCount<List<ServiceDTO>> getAllByFalseDeletedAndAcceptStatus(Pageable pageable);

    BaseResultWithDataAndCount<List<ServiceDTO>> getAllByServiceTypeAndAcceptStatus(Long serviceTypeId, Pageable pageable);

    BaseResultWithData<ServiceDetail> getDetailServiceById(Long serviceId);

    BaseResultWithDataAndCount<List<ImageAlbDTOConvert>> getAlbumOfServiceByNameAlb(Long serviceId, String albName);

    BaseResultWithDataAndCount<List<ServiceDTO>> getServiceBySupplier(Pageable pageable, Principal connectedUser);

    BaseResult upSertService(UpSertServiceDTO serviceDTO, MultipartFile avatar, List<MultipartFile> albums, Principal connectedUser);

    BaseResult deleteByIds(Long[] serviceIds);

    BaseResult deleteById(Long serviceId);
}

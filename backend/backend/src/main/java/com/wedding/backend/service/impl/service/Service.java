package com.wedding.backend.service.impl.service;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.common.StatusCommon;
import com.wedding.backend.dto.payment.PaymentByMonthDto;
import com.wedding.backend.dto.service.*;
import com.wedding.backend.dto.supplier.ServiceLimitResponse;
import com.wedding.backend.entity.*;
import com.wedding.backend.exception.ResourceNotFoundException;
import com.wedding.backend.mapper.ServiceMapper;
import com.wedding.backend.repository.ServiceAlbumRepository;
import com.wedding.backend.repository.ServiceRepository;
import com.wedding.backend.repository.ServiceTypeRepository;
import com.wedding.backend.repository.SupplierRepository;
import com.wedding.backend.service.IService.service.IService;
import com.wedding.backend.util.handler.FileHandler;
import com.wedding.backend.util.message.MessageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@org.springframework.stereotype.Service
@RequiredArgsConstructor
public class Service implements IService {
    private final ServiceRepository repository;
    private final ServiceMapper mapper;
    private final ServiceTypeRepository serviceTypeRepository;
    private final SupplierRepository supplierRepository;
    private final FileHandler fileHandler;
    private final ServiceAlbumRepository serviceAlbumRepository;

    @Override
    public BaseResultWithDataAndCount<List<ServiceDTO>> getAllByFalseDeletedAndAcceptStatus(Pageable pageable) {
        BaseResultWithDataAndCount<List<ServiceDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            List<ServiceDTO> resultFromDb = repository.findAllByIsDeletedFalse(pageable)
                    .stream()
                    .map(serviceEntity -> mapper.entityToDto(serviceEntity))
                    .filter(serviceDTO -> serviceDTO.getStatus().equals("APPROVED"))
                    .toList();
            Long countResultFromDb = (long) resultFromDb.size();

            result.set(resultFromDb, countResultFromDb);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResultWithDataAndCount<List<ServiceDTO>> getAllByServiceTypeAndAcceptStatus(Long serviceTypeId, Pageable pageable) {
        BaseResultWithDataAndCount<List<ServiceDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            Optional<ServiceTypeEntity> serviceTypeFromDb = serviceTypeRepository.findById(serviceTypeId);
            if (serviceTypeFromDb.isPresent()) {
                List<ServiceDTO> resultFromDb = repository.findAllByServiceTypeAndIsDeletedFalse(serviceTypeFromDb.get(), pageable)
                        .stream()
                        .map(serviceEntity -> mapper.entityToDto(serviceEntity))
                        .filter(serviceDTO -> serviceDTO.getStatus().equals("APPROVED"))
                        .toList();
                Long countResultFromDb = (long) resultFromDb.size();

                result.set(resultFromDb, countResultFromDb);
            } else {
                throw new ResourceNotFoundException(MessageUtil.MSG_SERVICE_TYPE_NOT_FOUND);
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResultWithData<ServiceDetail> getDetailServiceById(Long serviceId) {
        BaseResultWithData<ServiceDetail> result = new BaseResultWithData<>();
        try {
            ServiceDetail resultFromDb = repository.serviceDetailById(serviceId);
            result.Set(true, "", resultFromDb);
        } catch (Exception ex) {
            result.Set(false, ex.getMessage(), null);
        }
        return result;
    }

    @Override
    public BaseResultWithDataAndCount<List<ImageAlbDTOConvert>> getAlbumOfServiceByNameAlb(Long serviceId, String albName) {
        BaseResultWithDataAndCount<List<ImageAlbDTOConvert>> result = new BaseResultWithDataAndCount<>();
        try {
            List<ImageAlbDTOConvert> dataAfterConvert = repository.imagesOfAlbum(serviceId, albName)
                    .stream()
                    .map(this::convertData)
                    .toList();
            result.set(dataAfterConvert, (long) dataAfterConvert.size());
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResultWithDataAndCount<List<ServiceDTO>> getServiceBySupplier(Pageable pageable, Principal connectedUser) {
        BaseResultWithDataAndCount<List<ServiceDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            Optional<SupplierEntity> supplier = supplierRepository.findByUser_Id(user.getId());
            if (supplier.isPresent()) {
                List<ServiceDTO> resultFromDB = repository.findAllBySupplier_IdAndIsDeletedFalse(pageable, supplier.get().getId())
                        .stream()
                        .map(mapper::entityToDto)
                        .toList();

                result.set(resultFromDB, (long) resultFromDB.size());
            }
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResult upSertService(UpSertServiceDTO serviceDTO, MultipartFile avatar, List<MultipartFile> albums, Principal connectedUser) {
        try {
            ServiceEntity service;
            boolean isNewService = serviceDTO.getId() == null;
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            Optional<SupplierEntity> supplier = supplierRepository.findByUser_Id(user.getId());

            if (isNewService) {
                // Insert new service
                service = new ServiceEntity();
                supplier.ifPresent(service::setSupplier);
                service.setSelected(false);
                service.setDeleted(false); // Might want to check if this should only be set on creation
            } else {
                // Update existing service
                Optional<ServiceEntity> optionalService = repository.findById(serviceDTO.getId());
                if (optionalService.isPresent()) {
                    service = optionalService.get();
                } else {
                    return new BaseResult(false, MessageUtil.MSG_SERVICE_NOT_FOUND);
                }
            }

            // Common fields for insert and update
            service.setTitle(serviceDTO.getTitle());
            service.setInformation(serviceDTO.getInformation());
            service.setAddress(serviceDTO.getAddress());
            service.setLinkWebsite(serviceDTO.getLinkWebsite());
            service.setLinkFacebook(serviceDTO.getLinkFacebook());
            service.setRotation(serviceDTO.getRotation());

            service.setStatus(isNewService ? StatusCommon.REVIEW : service.getStatus());

            Optional<ServiceTypeEntity> serviceType = serviceTypeRepository.findById(serviceDTO.getServiceTypeId());
            serviceType.ifPresent(service::setServiceType);

            // Handle avatar upload
            if (avatar != null && !avatar.isEmpty()) {
                service.setImage(fileHandler.getFileUrls(avatar));
            }


            // Save or update the service entity
            ServiceEntity serviceFromDb = repository.save(service);

            // TODO: set serviceAlbum && set ServicePromotion
            if (albums != null && !albums.isEmpty()) {
                List<String> imagesURL = new ArrayList<>();
                for (MultipartFile file : albums) {
                    imagesURL.add(fileHandler.getFileUrls(file));
                }
                ServiceAlbumEntity serviceAlbum = new ServiceAlbumEntity();
                serviceAlbum.setServiceServiceAlbum(serviceFromDb);
                serviceAlbum.setName("default");
                serviceAlbum.setDescription("default");
                serviceAlbum.setImageUrlList(imagesURL);
                //TODO: Setup video if have
                serviceAlbumRepository.save(serviceAlbum);
            }
            // You may want to handle album and promotion updates/insertions here
            return new BaseResult(true, MessageUtil.MSG_ADD_SUCCESS);
        } catch (Exception ex) {
            return new BaseResult(false, ex.getMessage());
        }
    }

    @Override
    public BaseResult deleteByIds(Long[] serviceIds) {
        try {
            for (Long id : serviceIds
            ) {
                Optional<ServiceEntity> dataFromDb = repository.findById(id);
                dataFromDb.ifPresent(serviceEntity -> serviceEntity.setDeleted(true));
            }
            return new BaseResult(true, MessageUtil.MSG_DELETE_SUCCESS);
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }

    @Override
    public BaseResult deleteById(Long serviceId) {
        try {
            Optional<ServiceEntity> dataFromDb = repository.findById(serviceId);
            if (dataFromDb.isPresent()) {
                dataFromDb.get().setDeleted(true);
                repository.save(dataFromDb.get());
                return new BaseResult(true, MessageUtil.MSG_DELETE_SUCCESS);
            }
            return new BaseResult(false, "Delete is failed!");
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
    }

    @Override
    public BaseResultWithDataAndCount<?> getServiceByPackageVIP(Pageable pageable, Long packageId) {
        BaseResultWithDataAndCount<List<ServiceByPackageDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            List<ServiceByPackageDTO> dataFromDb = repository.serviceByPackageId(packageId, pageable);
            result.set(dataFromDb, (long) dataFromDb.size());
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResultWithDataAndCount<?> getServiceByPackageVIP1AndVIP2(Pageable pageable) {
        BaseResultWithDataAndCount<List<ServiceByPackageDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            List<ServiceByPackageDTO> dataVIP1FromDb = repository.serviceByPackageId(pageable);


            result.set(dataVIP1FromDb, (long) dataVIP1FromDb.size());
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResultWithDataAndCount<List<ServiceDTO>> getServiceBySupplierId(Long supplierId, Pageable pageable) {
        BaseResultWithDataAndCount<List<ServiceDTO>> result = new BaseResultWithDataAndCount<>();
        try {
            List<ServiceDTO> resultFromDB = repository.findAllBySupplier_IdAndIsDeletedFalse(pageable, supplierId)
                    .stream()
                    .map(mapper::entityToDto)
                    .filter(serviceDTO -> serviceDTO.getStatus().equals("APPROVED"))
                    .toList();
            result.set(resultFromDB, (long) resultFromDB.size());

        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }

    @Override
    public BaseResult setIsApprovedPosts(Long[] listServiceId) {
        try {
            for (Long id : listServiceId) {
                Optional<ServiceEntity> dataFromDb = repository.findById(id);
                if (dataFromDb.isPresent()) {
                    dataFromDb.get().setStatus(StatusCommon.APPROVED);
                    repository.save(dataFromDb.get());
                }
            }
        } catch (Exception ex) {
            return new BaseResult(false, ex.getMessage());
        }
        return new BaseResult(true, MessageUtil.UPDATE_STATUS_SERVICE_SUCCESS);
    }

    @Override
    public BaseResult setIsRejectedPosts(Long[] listServiceId) {
        try {
            for (Long id : listServiceId) {
                Optional<ServiceEntity> dataFromDb = repository.findById(id);
                if (dataFromDb.isPresent()) {
                    dataFromDb.get().setStatus(StatusCommon.REJECTED);
                    repository.save(dataFromDb.get());
                }
            }
        } catch (Exception ex) {
            return new BaseResult(false, ex.getMessage());
        }
        return new BaseResult(true, MessageUtil.UPDATE_STATUS_SERVICE_SUCCESS);
    }

    public ImageAlbDTOConvert convertData(ImageAlbDTO dataConvert) {
        return ImageAlbDTOConvert.builder()
                .imageURL(dataConvert.getImagesURL())
                .albName(dataConvert.getNameAlb())
                .build();
    }

    @Override
    public ResponseEntity<?> getTotalPaymentServiceByMonth() {
        ResponseEntity<?> responseEntity;
        try {
            List<Object[]> result = repository.getTotalPaymentServiceByMonth();
            List<PaymentByMonthDto> paymentByMonthDtoList = result.stream()
                    .map(row -> new PaymentByMonthDto((Integer) row[0], (BigDecimal) row[1]))
                    .toList();
            responseEntity = new ResponseEntity<>(paymentByMonthDtoList, HttpStatus.OK);
        } catch (Exception e) {
            responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_ID_FORMAT_INVALID),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @Override
    public ResponseEntity<?> getStatusService() {
        ResponseEntity<?> responseEntity = null;
        try {
            Long countPost = this.repository.countByIsDeletedFalse();
            Long countApprovedPost = this.repository.countByStatus(StatusCommon.APPROVED);
            Long countRejectedPost = this.repository.countByStatus(StatusCommon.REJECTED);
            Long countReviewPost = this.repository.countByStatus(StatusCommon.REVIEW);
            StatusService status;
            if (countPost == 0) {
                status = new StatusService(0L, 0L, 0L);
                return new ResponseEntity<>(status, HttpStatus.OK);
            }

            Long percentApproved = Math.round((countApprovedPost.doubleValue() / countPost.doubleValue()) * 100.0);
            Long percentRejected = Math.round((countRejectedPost.doubleValue() / countPost.doubleValue()) * 100.0);
            Long percentReview = Math.round((countReviewPost.doubleValue() / countPost.doubleValue()) * 100.0);
            status = new StatusService(percentApproved, percentRejected, percentReview);
            return new ResponseEntity<>(status, HttpStatus.OK);
        } catch (Exception e) {
            responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @Override
    public BaseResult updateServiceSelected(Long serviceId) {
        try {
            Optional<ServiceEntity> service = repository.findById(serviceId);
            if (service.isPresent()) {
                if (service.get().isSelected()) {
                    service.get().setSelected(false);
                } else if (service.get().getStatus().equals(StatusCommon.REVIEW) || service.get().getStatus().equals(StatusCommon.REJECTED)) {
                    return new BaseResult(false, MessageUtil.MSG_STATUS_SERVICE_NOT_APPROVED);
                } else {
                    Long countServiceSelected = repository.countBySupplier_IdAndIsSelected(service.get().getSupplier().getId(), true);
                    ServiceLimitResponse serviceLimitOfPackageVIP = supplierRepository.getServiceLimitOfPackageVIP(service.get().getSupplier().getId());
                    if (countServiceSelected < serviceLimitOfPackageVIP.getServiceLimit()) {
                        service.get().setSelected(true);
                    } else {
                        return new BaseResult(false, MessageUtil.MSG_SERVICE_LIMIT_OF_PACKAGE_VIP);
                    }
                }
                repository.save(service.get());
                return new BaseResult(true, MessageUtil.MSG_UPDATE_SUCCESS);
            } else {
                return new BaseResult(false, MessageUtil.MSG_SERVICE_NOT_FOUND);
            }
        } catch (Exception ex) {
            return new BaseResult(false, ex.getMessage());
        }
    }

    @Override
    public BaseResultWithDataAndCount<List<ServiceBySuggest>> serviceByUserFollowingSupplier(Principal connectedUser, Pageable pageable) {
        BaseResultWithDataAndCount<List<ServiceBySuggest>> result = new BaseResultWithDataAndCount<>();
        try {
            List<ServiceBySuggest> dataFromDb;

            // Nếu có người dùng kết nối: dang nhap roi
            if (connectedUser != null) {
                var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

                // Kiểm tra nếu không có thông tin người dùng
                if (user == null) {
                    throw new ResourceNotFoundException(MessageUtil.MSG_USER_BY_TOKEN_NOT_FOUND);
                }

                // Lấy dịch vụ từ các nhà cung cấp mà người dùng theo dõi
                dataFromDb = repository.serviceByUserFollowingSupplier(user.getId(), pageable);

                // Nếu không có dịch vụ nào từ nhà cung cấp mà người dùng theo dõi, lấy dịch vụ dựa trên xếp hạng trung bình
                if (dataFromDb.isEmpty()) {
                    dataFromDb = repository.serviceByAverageRating(pageable);
                }
            } else {
                // Nếu người dùng không đăng nhập, chỉ lấy dịch vụ dựa trên xếp hạng trung bình
                dataFromDb = repository.serviceByAverageRating(pageable);
            }

            // Đặt kết quả và số lượng dữ liệu trả về
            result.set(dataFromDb, (long) dataFromDb.size());

        } catch (ResourceNotFoundException ex) {
            // Xử lý ngoại lệ cụ thể
            throw ex;
        } catch (Exception ex) {
            // Xử lý ngoại lệ chung
            throw new ResourceNotFoundException("An error occurred while fetching services: " + ex.getMessage());
        }

        return result;
    }


}

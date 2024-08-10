package com.wedding.backend.controller.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.backend.dto.service.UpSertServiceDTO;
import com.wedding.backend.service.IService.service.IService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/v1/service")
@RequiredArgsConstructor
@CrossOrigin("*")
@PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPLIER','ROLE_ADMIN')")
public class ServiceController {
    private final IService service;

    /*
     * Find all service with condition is deleted is false and status is APPROVED
     * */
    @GetMapping("/getAllByDeleted")
    public ResponseEntity<?> getAllByFalseDeletedAndAcceptStatus(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                                 @RequestParam(name = "size", required = false, defaultValue = "5") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getAllByFalseDeletedAndAcceptStatus(pageable));
    }

    @GetMapping("/getAllByServiceType")
    public ResponseEntity<?> getAllByServiceTypeAndAcceptStatus(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                                @RequestParam(name = "size", required = false, defaultValue = "5") Integer size, @RequestParam(name = "serviceType", defaultValue = "1") Long serviceTypeId) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getAllByServiceTypeAndAcceptStatus(serviceTypeId, pageable));
    }

    @GetMapping("/detail-service")
    public ResponseEntity<?> getDetailServiceById(@RequestParam("serviceId") Long serviceId) {
        return ResponseEntity.ok(service.getDetailServiceById(serviceId));
    }

    @GetMapping("/getBySupplier")
    public ResponseEntity<?> getServicesBySupplier(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                   @RequestParam(name = "size", required = false, defaultValue = "5") Integer size, Principal connectedUser) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getServiceBySupplier(pageable, connectedUser));
    }

    @PostMapping(value = "/update-insert",
            consumes = {MediaType.MULTIPART_FORM_DATA_VALUE,
                    MediaType.APPLICATION_OCTET_STREAM_VALUE,
                    MediaType.APPLICATION_JSON_VALUE
            })
    public ResponseEntity<?> upSertService(
            @RequestPart(required = false, name = "serviceDto") String serviceDto,
            @RequestPart(required = false, name = "images") @Valid MultipartFile avatar,
            @RequestPart(required = false, name = "albums") @Valid List<MultipartFile> albums,
            Principal connectedUser
    ) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            UpSertServiceDTO upSertServiceDTO = objectMapper.readValue(serviceDto, UpSertServiceDTO.class);
            return ResponseEntity.ok(service.upSertService(upSertServiceDTO, avatar, albums, connectedUser));
        } catch (Exception ex) {
            return ResponseEntity.ok(ex.getMessage());
        }
    }

    @DeleteMapping(value = "delete-by-id")
    public ResponseEntity<?> deleteService(@RequestParam(name = "serviceId") Long serviceId) {
        return ResponseEntity.ok(service.deleteById(serviceId));
    }

    @DeleteMapping(value = "delete-by-ids")
    public ResponseEntity<?> deleteService(Long[] serviceIds) {
        return ResponseEntity.ok(service.deleteByIds(serviceIds));
    }
}

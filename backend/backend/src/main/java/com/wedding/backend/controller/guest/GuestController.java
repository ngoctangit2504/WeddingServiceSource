package com.wedding.backend.controller.guest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.backend.dto.report.ReportDto;
import com.wedding.backend.entity.SupplierEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.repository.SupplierRepository;
import com.wedding.backend.service.IService.report.IReportService;
import com.wedding.backend.service.IService.service.IDatabaseSearch;
import com.wedding.backend.service.IService.service.IService;
import com.wedding.backend.service.IService.service.IServicePackage;
import com.wedding.backend.service.IService.service.IServiceType;
import com.wedding.backend.service.IService.supplier.ISupplierService;
import com.wedding.backend.util.extensions.ConvertStringToArrayExtension;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.Optional;

@RestController
@RequestMapping("api/v1/guest")
@CrossOrigin("*")
@RequiredArgsConstructor
public class GuestController {
    private final IService service;

    private final IDatabaseSearch iDatabaseSearch;

    private final SupplierRepository supplierRepository;

    private final IServicePackage servicePackage;

    private final IReportService reportService;

    private final ISupplierService supplierService;

    private final IServiceType serviceType;


    @PostMapping(value = "/service/filters", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> searchPost(@RequestPart(required = false, name = "json") String json,

                                        @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                        @RequestParam(name = "size", required = false, defaultValue = "5") Integer size, Principal connectedUser) throws SQLException {

        Pageable pageable = PageRequest.of(page, size);
        ObjectMapper objectMapper = new ObjectMapper();
        LinkedHashMap<String, Object> map = new LinkedHashMap<>();
        if (json != null) {
            try {
                map = objectMapper.readValue(json, LinkedHashMap.class);
                for (var item : map.entrySet()) {
                    if ("supplier_id".equals(item.getKey()) && item.getValue() == null) {
                        if (connectedUser != null) {
                            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
                            Optional<SupplierEntity> supplier = supplierRepository.findByUser_Id(user.getId());
                            if (supplier.isPresent()) {
                                map.replace("supplier_id", supplier.get().getId());
                            }
                        } else {
                            map.remove("supplier_id");
                        }
                    }
                }

                ConvertStringToArrayExtension.convertStringToArray(map);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
        }
        return ResponseEntity.ok(iDatabaseSearch.searchFilter(pageable, map));
    }

    @GetMapping("/albByName")
    public ResponseEntity<?> getAlbumOfServiceByNameAlb(@RequestParam(name = "serviceId") Long serviceId,
                                                        @RequestParam(name = "albName", defaultValue = "default") String albName) {
        return ResponseEntity.ok(service.getAlbumOfServiceByNameAlb(serviceId, albName));
    }

    @GetMapping(value = "/service/service-package")
    public ResponseEntity<?> getAllServicePackage(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                  @RequestParam(name = "size", required = false, defaultValue = "5") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return servicePackage.getAllServicePackage(pageable);

    }

    @GetMapping("/service/services-by-package-vip")
    public ResponseEntity<?> getServicesByPackageVIP(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                     @RequestParam(name = "size", required = false, defaultValue = "5") Integer size,
                                                     @RequestParam(name = "packageId") Long packageId) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getServiceByPackageVIP(pageable, packageId));
    }


    @GetMapping("/service/services-by-package-VIP1-VIP2")
    public ResponseEntity<?> getServicesByPackageVIP1AndVIP2(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                             @RequestParam(name = "size", required = false, defaultValue = "5") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getServiceByPackageVIP1AndVIP2(pageable));
    }

    @PostMapping(value = "/report/add")
    public ResponseEntity<?> addReport(@RequestBody ReportDto reportDto) {
        return ResponseEntity.ok(reportService.addReport(reportDto));
    }

    @GetMapping("/get/{supplierId}")
    public ResponseEntity<?> getSupplier(@PathVariable(name = "supplierId") Long supplierId) {
        return ResponseEntity.ok(supplierService.getSupplier(supplierId));
    }

    @GetMapping("/service/{supplierId}")
    public ResponseEntity<?> getServiceBySupplierId(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                    @RequestParam(name = "size", required = false, defaultValue = "5") Integer size,
                                                    @PathVariable(name = "supplierId") Long supplierId) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getServiceBySupplierId(supplierId, pageable));
    }

    @GetMapping("/service-type-name/{supplierId}")
    public ResponseEntity<?> serviceTypeNameBySupplier(@PathVariable(name = "supplierId") Long supplierId) {
        return ResponseEntity.ok(serviceType.serviceTypeNameBySupplier(supplierId));
    }


}

package com.wedding.backend.controller.admin;

import com.wedding.backend.dto.servicePackage.ServicePackageDto;
import com.wedding.backend.service.IService.service.IServicePackage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
@CrossOrigin(origins = "*")
public class AdminController {
    private final IServicePackage servicePackageService;

    //TODO: CRUD service package
    @PostMapping(value = "/service/add-service-package")
    public ResponseEntity<?> addServicePackage(@RequestBody ServicePackageDto request) {
        return servicePackageService.addServicePackage(request);
    }

    @PutMapping(value = "/service/update-service-package/{id}")
    public ResponseEntity<?> updateServicePackage(@PathVariable(name = "id") Long id,
                                                  @RequestBody ServicePackageDto request) {
        return servicePackageService.updateServicePackage(id, request);
    }

    @DeleteMapping(value = "/service/delete-service-package/{id}")
    public ResponseEntity<?> deleteServicePackage(@PathVariable(name = "id") Long id) {
        return servicePackageService.removeServicePackageById(id);
    }
}

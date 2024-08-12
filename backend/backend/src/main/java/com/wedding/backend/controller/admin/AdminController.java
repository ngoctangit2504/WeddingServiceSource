package com.wedding.backend.controller.admin;

import com.wedding.backend.dto.auth.RoleDTO;
import com.wedding.backend.dto.servicePackage.ServicePackageDto;
import com.wedding.backend.service.IService.auth.IRoleService;
import com.wedding.backend.service.IService.service.IService;
import com.wedding.backend.service.IService.service.IServicePackage;
import com.wedding.backend.service.IService.user.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    private final IService service;

    private final IUserService userService;

    private final IRoleService roleService;

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

    //TODO: CRUD Post
    @PatchMapping(value = "/setIsApprovedService")
    public ResponseEntity<?> setIsApprovedPosts(Long[] listServiceId) {
        return ResponseEntity.ok(service.setIsApprovedPosts(listServiceId));
    }

    @PatchMapping(value = "/setIsRejectedService")
    public ResponseEntity<?> setIsRejectedPosts(Long[] listServiceId) {
        return ResponseEntity.ok(service.setIsRejectedPosts(listServiceId));

    }


    //TODO: CRUD Account User
    @GetMapping(value = "/user/getAll")
    public ResponseEntity<?> getAllAccountByDeletedFalse(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                         @RequestParam(name = "size", required = false, defaultValue = "5") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.findAllByIsDeletedIsFalse(pageable);
    }

    @GetMapping(value = "/user/getAllByDeleted")
    public ResponseEntity<?> getAllAccountByDeletedTrue(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                        @RequestParam(name = "size", required = false, defaultValue = "5") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.findAllByIsDeletedIsTrue(pageable);
    }

    @GetMapping(value = "/user/by-role-name")
    public ResponseEntity<?> getAllAccountByRoleName(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                     @RequestParam(name = "size", required = false, defaultValue = "5") Integer size,
                                                     @RequestParam(name = "roleName") String roleName
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return userService.findAllAccountByRoleName(pageable, roleName);
    }

    @DeleteMapping(value = "/user/delete")
    public ResponseEntity<?> deleteAccount(@RequestParam(name = "listId") String[] listId) {
        return userService.deleteUserByIds(listId);
    }

    //TODO: CRUD Role
    @GetMapping(value = "/role/getAll")
    public ResponseEntity<?> getAllRole() {
        return roleService.getAll();
    }

    @PostMapping(value = "/role")
    public ResponseEntity<?> addRole(@RequestBody RoleDTO request) {
        return roleService.addRole(request);
    }
}

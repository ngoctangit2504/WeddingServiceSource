package com.wedding.backend.controller.supplier;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.backend.dto.supplier.SupplierDTO;
import com.wedding.backend.dto.supplier.UpdateSupplierRequest;
import com.wedding.backend.service.IService.supplier.ISupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("api/v1/supplier")
@CrossOrigin("*")
@RequiredArgsConstructor
public class SupplierController {
    private final ISupplierService service;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllSuppliers(@RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                             @RequestParam(name = "size", required = false, defaultValue = "5") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(service.getSuppliersByFalseDeleted(pageable));
    }


    @GetMapping("/get/{supplierId}")
    public ResponseEntity<?> getSupplier(@PathVariable Long supplierId) {
        return ResponseEntity.ok(service.getSupplier(supplierId));
    }

    @GetMapping("/getByUser")
    public ResponseEntity<?> getSupplierByUser(Principal connectedUser) {
        return ResponseEntity.ok(service.getSupplierByUser(connectedUser));
    }


    @PostMapping(value = "/update-supplier", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> updateSupplier(@RequestPart(name = "supplierRequest") String supplierRequest,
                                            @RequestPart(required = false, name = "supplierImage") @Valid MultipartFile supplierImage,
                                            Principal connectedUser) throws IOException {

        ObjectMapper objectMapper = new ObjectMapper();
        UpdateSupplierRequest supplier = objectMapper.readValue(supplierRequest, UpdateSupplierRequest.class);

        return ResponseEntity.ok(service.updateSupplier(supplier, supplierImage, connectedUser));
    }

    @PostMapping(value = "/add", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE}, produces = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> addSupplier(@RequestPart(name = "request") String request,
                                         @RequestPart(required = false, name = "supplierImage") @Valid MultipartFile supplierImage,
                                         Principal connectedUser) throws JsonProcessingException {
        ObjectMapper objectMapper = new ObjectMapper();
        SupplierDTO supplierDTO = objectMapper.readValue(request, SupplierDTO.class);
        return ResponseEntity.ok(service.addSupplier(supplierDTO, supplierImage, connectedUser));
    }

    @GetMapping(value = "supplier-is-exit-by-userId")
    public ResponseEntity<?> supplierIsExitedByUserId(Principal connectedUser) {
        return ResponseEntity.ok(service.checkSupplierExitByUserId(connectedUser));
    }
}

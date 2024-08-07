package com.wedding.backend.controller.service;

import com.wedding.backend.service.IService.service.IServiceType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/service-type")
@CrossOrigin("*")
public class ServiceTypeController {
    private final IServiceType serviceType;

    @GetMapping("/getAll")
    public ResponseEntity<?> getAllServiceType() {
        return ResponseEntity.ok(serviceType.getAllServiceType());
    }
}

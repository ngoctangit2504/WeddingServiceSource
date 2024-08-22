package com.wedding.backend.controller.service;

import com.wedding.backend.service.IService.service.IServiceType;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


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

    @PostMapping("/up-insert")
    public ResponseEntity<?> upInsertServiceType(){
        return serviceType.upsertServiceType();
    }
}

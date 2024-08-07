package com.wedding.backend.controller.auth;

import com.wedding.backend.dto.auth.RoleDTO;
import com.wedding.backend.service.IService.auth.IRoleService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/role")
@RequiredArgsConstructor
public class RoleController {

    private final IRoleService roleService;

    @Operation(
            description = "Format role is [ROLE_]",
            summary = "Endpoint For add role"
    )

    @PostMapping("/add")
    public ResponseEntity<?> addRole(@RequestBody RoleDTO request) {
        return roleService.addRole(request);
    }
}

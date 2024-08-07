package com.wedding.backend.service.IService.auth;

import com.wedding.backend.dto.auth.RoleDTO;
import org.springframework.http.ResponseEntity;

public interface IRoleService {
    ResponseEntity<?> addRole(RoleDTO request);
}

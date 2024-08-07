package com.wedding.backend.service.impl.auth;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.dto.auth.RoleDTO;
import com.wedding.backend.entity.RoleEntity;
import com.wedding.backend.mapper.RoleMapper;
import com.wedding.backend.repository.RoleRepository;
import com.wedding.backend.service.IService.auth.IRoleService;
import com.wedding.backend.util.message.MessageUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RoleService implements IRoleService {

    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Override
    public ResponseEntity<?> addRole(RoleDTO request) {
        ResponseEntity<?> response = null;
        BaseResult baseResult = null;
        try {
            Optional<RoleEntity> checkRoleIsExit = Optional.ofNullable(roleRepository.findByName(request.getName()));
            if (checkRoleIsExit.isEmpty()) {
                RoleEntity roleEntity = roleMapper.dtoToEntity(request);
                roleRepository.save(roleEntity);
                baseResult = BaseResult.builder()
                        .success(true)
                        .message(MessageUtil.MSG_ADD_SUCCESS)
                        .build();
                response = new ResponseEntity<>(baseResult, HttpStatus.OK);
            } else {
                baseResult = BaseResult.builder()
                        .success(false)
                        .message(MessageUtil.MSG_ROLE_EXITED)
                        .build();
                response = new ResponseEntity<>(baseResult, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception ex) {
            baseResult = BaseResult.builder()
                    .success(false)
                    .message(ex.getMessage())
                    .build();
            response = new ResponseEntity<>(baseResult, HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
}

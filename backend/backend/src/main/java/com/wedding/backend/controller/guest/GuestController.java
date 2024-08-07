package com.wedding.backend.controller.guest;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wedding.backend.dto.service.ServiceDTO;
import com.wedding.backend.entity.SupplierEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.repository.SupplierRepository;
import com.wedding.backend.service.IService.service.IDatabaseSearch;
import com.wedding.backend.service.IService.service.IService;
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
                for (var item : map.entrySet()
                ) {
                    if (item.getKey().equals("supplier_id")) {
                        if (connectedUser != null) {
                            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
                            Optional<SupplierEntity> supplier = supplierRepository.findByUser_Id(user.getId());
                            if (supplier.isPresent()) {
                                map.replace("supplier_id", supplier.get().getId());
                            }
                        }else {
                            map.remove("supplierId");
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


}

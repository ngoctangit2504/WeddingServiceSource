package com.wedding.backend.dto.supplier;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class SupplierDTO {
    private Long id;
    private String name;
    private String logo;
    private String phoneNumberSupplier;
    private String emailSupplier;
    private String addressSupplier;
    private Integer followerCount;
}

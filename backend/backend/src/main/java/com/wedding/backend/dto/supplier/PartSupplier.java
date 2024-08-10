package com.wedding.backend.dto.supplier;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PartSupplier {
    private Long supplierId;
    private String userName;
    private String phoneNumber;
    private String images;
}

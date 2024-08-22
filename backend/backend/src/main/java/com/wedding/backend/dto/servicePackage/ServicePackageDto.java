package com.wedding.backend.dto.servicePackage;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServicePackageDto {

    private Long servicePackageId;

    private String name;

    private String description;

    private Integer durationDays;

    private Integer serviceLimit;

    private BigDecimal price;

    private Date createdDate;

    private Date modifiedDate;

    private String modifiedBy;
}

package com.wedding.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "service_package")
@Getter
@Setter
public class ServicePackageEntity extends BaseEntityWithIDIncrement {
    @Column(name = "service_package_name", length = 100)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "duration_days")
    private Integer durationDays;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "service_limit")
    private Integer serviceLimit; // để lưu số lượng dịch vụ có thể đăng

    @OneToMany(mappedBy = "servicePackage")
    @JsonManagedReference
    private List<TransactionEntity> transactionEntities = new ArrayList<>();
}

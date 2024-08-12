package com.wedding.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "supplier")
public class SupplierEntity extends BaseEntityWithIDIncrement {

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "logo")
    private String logo;

    @Column(name = "phone_number_supplier")
    private String phoneNumberSupplier;

    @Column(name = "email_supplier")
    private String emailSupplier;

    @Column(name = "address_supplier")
    private String addressSupplier;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "follower")
    private Integer follower;

    @JsonManagedReference
    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity user;

    @OneToMany(mappedBy = "supplier")
    private List<ServiceEntity> services;

    @OneToMany(mappedBy = "userTransaction")
    @JsonManagedReference
    private List<TransactionEntity> transactionEntities;
}

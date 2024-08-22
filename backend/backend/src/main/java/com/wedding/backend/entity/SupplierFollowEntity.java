package com.wedding.backend.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "User_Supplier_Follow")
@Getter
@Setter
public class SupplierFollowEntity extends BaseEntityWithIDIncrement {
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private UserEntity user;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "id", nullable = false)
    @JsonBackReference
    private SupplierEntity supplierFollow;
}

package com.wedding.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.util.Date;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Data
public abstract class BaseEntityWithIDIncrement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedBy
    @Column(
            name = "created_by",
            nullable = false,
            updatable = false
    )
    private String createdBy;

    @LastModifiedBy
    @Column(
            name = "modified_by",
            insertable = false)
    private String modifiedBy;

    @CreatedDate
    @Column(name = "created_date",
            nullable = false,
            updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdDate;

    @LastModifiedDate
    @Column(name = "modified_date",
            insertable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date modifiedDate;
}

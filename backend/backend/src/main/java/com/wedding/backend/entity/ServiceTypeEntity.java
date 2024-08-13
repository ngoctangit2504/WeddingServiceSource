package com.wedding.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "service_types")
public class ServiceTypeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "icon_url")
    private String iconURL;

    @Column(name = "image_url")
    private String imageURL;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "serviceType")
    @JsonBackReference
    private List<ServiceEntity> services;
}

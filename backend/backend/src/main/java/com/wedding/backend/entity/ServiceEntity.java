package com.wedding.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.wedding.backend.common.StatusCommon;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "services")
public class ServiceEntity extends BaseEntityWithIDIncrement {
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "information", columnDefinition = "TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
    @Lob
    private String information;

    @Column(name = "image")
    private String image;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "address")
    private String address;

    @Column(name = "phone_number")
    private String phoneNumber;

    @Column(name = "link_website")
    private String linkWebsite;

    @Column(name = "link_facebook")
    private String linkFacebook;

    @Column(name = "rotation")
    private String rotation;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Enumerated(EnumType.STRING)
    private StatusCommon status;

    @JsonIgnore
    @ManyToOne()
    @JoinColumn(name = "supplier_id", referencedColumnName = "id")
    private SupplierEntity supplier;

    @ManyToOne()
    @JoinColumn(name = "service_type_id", referencedColumnName = "id")
    @JsonManagedReference
    private ServiceTypeEntity serviceType;

    @JsonManagedReference
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @OneToOne(mappedBy = "serviceServiceAlbum")
    private ServiceAlbumEntity serviceAlbum;

    @JsonManagedReference
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    @OneToOne(mappedBy = "serviceServicePromotion")
    private ServicePromotionEntity servicePromotion;

    @OneToMany(mappedBy = "servicesReport")
    @JsonBackReference
    private List<ReportEntity> reports;

    @OneToMany(mappedBy = "serviceRating")
    @JsonBackReference
    private List<RatingEntity> ratings;

    @OneToMany(mappedBy = "serviceComment")
    @JsonBackReference
    private List<CommentEntity> comments;

}

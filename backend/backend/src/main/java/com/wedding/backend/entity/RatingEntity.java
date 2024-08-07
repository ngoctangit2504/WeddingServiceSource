package com.wedding.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ratings", uniqueConstraints = { @UniqueConstraint(name = "UP_ratings", columnNames = { "service_id", "user_id" }) })
public class RatingEntity extends BaseEntityWithIDIncrement {

    @Column(name = "star_point")
    private double starPoint;

    @JsonManagedReference
    @ManyToOne()
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    private ServiceEntity serviceRating;

    @JsonManagedReference
    @ManyToOne()
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity userRating;
}

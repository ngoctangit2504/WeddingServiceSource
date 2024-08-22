package com.wedding.backend.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.wedding.backend.common.StatusCommon;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "bookings")
public class BookingEntity extends BaseEntityWithIDIncrement {

    @Column(name = "name")
    private String name;
    @Column(name = "email")
    private String email;
    @Column(name = "phone_number")
    private String phoneNumber;
    @Column(name = "note")
    private String notes;

    @Enumerated(EnumType.STRING)
    private StatusCommon status;

    @JsonManagedReference
    @ManyToOne()
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    private ServiceEntity serverBooking;
}

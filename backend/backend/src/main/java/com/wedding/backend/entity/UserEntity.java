package com.wedding.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.math.BigDecimal;
import java.util.*;

@Entity
@Table(
        name = "users",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "phone_number_unique",
                        columnNames = "phone_number"
                ),
                @UniqueConstraint(
                        name = "profile_image_unique",
                        columnNames = "profile_image"
                )
        })
@Getter
@Setter
public class UserEntity extends BaseEntity implements UserDetails {
    @Column(
            name = "user_name",
            nullable = false
    )
    private String userName;

    @Column(
            name = "password_hash",
            nullable = false
    )
    private String passwordHash;

    @Column(name = "email")
    private String email;

    @Column(
            name = "profile_image",
            unique = true
    )
    private String profileImage;

    @Column(
            name = "phone_number",
            nullable = false,
            unique = true
    )
    private String phoneNumber;

    @Column(name = "phone_number_confirmed")
    private boolean phoneNumberConfirmed;

    @Column(name = "two_factor_enable")
    private boolean twoFactorEnable;

    @Column(name = "is_active")
    private boolean isActive;

    @Column(name = "is_deleted")
    private boolean isDeleted;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Column(name = "address")
    private String address;

    @Column(name = "balance")
    private BigDecimal balance;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<RoleEntity> roles = new HashSet<>();

    @OneToMany(mappedBy = "userEntity")
    @JsonManagedReference
    private List<TokenEntity> tokens = new ArrayList<>();

    @OneToMany(mappedBy = "userWishList")
    @JsonManagedReference
    private List<WishlistEntity> wishlists;

    @JsonBackReference
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private SupplierEntity suppliers;

    @OneToMany(mappedBy = "userRating")
    @JsonBackReference
    private List<RatingEntity> ratings;

    @OneToMany(mappedBy = "userComment")
    @JsonBackReference
    private List<CommentEntity> comments;

    @OneToMany(mappedBy = "userPayment")
    @JsonManagedReference
    private List<PaymentEntity> payments;

    /**
     * Retrieves the authorities (roles) assigned to the user.
     * This method is used by Spring Security to determine the user's
     * granted authorities for access control.
     *
     * @return A collection of GrantedAuthority objects representing the user's roles.
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        for (RoleEntity role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }
        return authorities;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    @Override
    public String getPassword() {
        return this.passwordHash;
    }

    @Override
    public String getUsername() {
        return this.phoneNumber;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}

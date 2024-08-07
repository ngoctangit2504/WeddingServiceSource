package com.wedding.backend.repository;

import com.wedding.backend.entity.RoleEntity;
import com.wedding.backend.entity.UserEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findById(String id);
    Optional<UserEntity> findByPhoneNumber(String phoneNumber);

    List<UserEntity> findAllByIsDeletedTrue(Pageable pageable);

    Long countAllByIsDeletedTrue();

    List<UserEntity> findAllByIsDeletedFalse(Pageable pageable);

    List<UserEntity> findAllByRolesNotContainingAndIsDeletedFalse(RoleEntity role);

    Long countAllByIsDeletedFalse();

    boolean existsByPhoneNumber(String phoneNumber);

    List<UserEntity> findAllByRoles_NameAndIsDeletedFalse(String roleName);

    Long countByRoles_NameAndIsDeletedFalse(String roleName);
}
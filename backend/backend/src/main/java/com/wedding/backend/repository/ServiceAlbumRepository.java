package com.wedding.backend.repository;

import com.wedding.backend.entity.ServiceAlbumEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceAlbumRepository extends JpaRepository<ServiceAlbumEntity, Long> {
}

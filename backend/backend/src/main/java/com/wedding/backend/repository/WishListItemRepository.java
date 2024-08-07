package com.wedding.backend.repository;

import com.wedding.backend.entity.WishlistItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListItemRepository extends JpaRepository<WishlistItemEntity, Long> {
    List<WishlistItemEntity> findAllByWishlist_WishlistId(Long wishListId);
}

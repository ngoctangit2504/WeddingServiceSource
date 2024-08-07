package com.wedding.backend.service.IService.customer;

import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.security.Principal;

public interface IWishListService {
    ResponseEntity<?> addServiceToWishlist(Principal connectedUser, Long postId, String wishListName);

    ResponseEntity<?> getWishListByNameAndUser(Principal connectedUser, String wishListName, Pageable pageable);
    ResponseEntity<?> deleteWishListItem(Long wishListItemId);
}

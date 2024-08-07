package com.wedding.backend.controller.customer;

import com.wedding.backend.service.IService.customer.IWishListService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/wishlist")
@PreAuthorize("hasAnyRole('ROLE_CUSTOMER','ROLE_SUPPLIER','ROLE_ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WishListController {

    private final IWishListService wishListService;

    @PostMapping(value = "/add")
    public ResponseEntity<?> addWishList(@RequestParam(name = "postId") Long postId,
                                         @RequestParam(name = "wishlistName") String wishlistName,
                                         Principal connectedUser) {
        return wishListService.addServiceToWishlist(connectedUser, postId, wishlistName);
    }

    @GetMapping(value = "/get")
    public ResponseEntity<?> getWishListByNameAndUser(Principal connectedUser,
                                                      @RequestParam(name = "wishListName") String wishListName,
                                                      @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
                                                      @RequestParam(name = "size", required = false, defaultValue = "5") Integer size) {
        Pageable pageable = PageRequest.of(page, size);
        return wishListService.getWishListByNameAndUser(connectedUser, wishListName, pageable);
    }

    @DeleteMapping(value = "delete/wishListItem/{wishListItemId}")
    public ResponseEntity<?> deleteWishListItem(@PathVariable(name = "wishListItemId") Long wishListItemId) {
        return wishListService.deleteWishListItem(wishListItemId);
    }
}

package com.wedding.backend.service.impl.customer;


import com.wedding.backend.base.BaseResult;
import com.wedding.backend.dto.service.ServiceByWishList;
import com.wedding.backend.entity.ServiceEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.entity.WishlistEntity;
import com.wedding.backend.entity.WishlistItemEntity;
import com.wedding.backend.repository.ServiceRepository;
import com.wedding.backend.repository.WishListItemRepository;
import com.wedding.backend.repository.WishListRepository;
import com.wedding.backend.service.IService.customer.IWishListService;
import com.wedding.backend.util.message.MessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class WishListService implements IWishListService {

    @Autowired
    private WishListRepository wishListRepository;

    @Autowired
    private WishListItemRepository wishListItemRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Override
    public ResponseEntity<?> addServiceToWishlist(Principal connectedUser, Long serviceId, String wishListName) {
        ResponseEntity<?> responseEntity = null;
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();

            if (user != null) {
                var exitWishListItem = wishListRepository.wishListItemExit(wishListName, serviceId, user.getId());
                if (exitWishListItem == null) {
                    WishlistEntity wishlist = wishListRepository.findByUserWishList_IdAndWishlistName(user.getId(), wishListName);
                    if (wishlist == null) {
                        wishlist = new WishlistEntity();
                        wishlist.setWishlistName(wishListName);
                        wishlist.setUserWishList(user);
                        wishlist = wishListRepository.save(wishlist);
                    }
                    Optional<ServiceEntity> service = serviceRepository.findById(serviceId);
                    if (service.isPresent()) {
                        WishlistItemEntity wishlistItem = new WishlistItemEntity();
                        wishlistItem.setWishlist(wishlist);
                        wishlistItem.setServiceId(service.get().getId());
                        wishlistItem.setCreatedDate(new Date());
                        // add wishlist item to wishlist
                        wishlist.getWishlistItems().add(wishlistItem);
                        wishListItemRepository.save(wishlistItem);
                        responseEntity = new ResponseEntity<>(wishlist, HttpStatus.OK);
                    } else {
                        responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SERVICE_NOT_FOUND), HttpStatus.NOT_FOUND);
                    }
                } else {
                    responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_WISHLIST_ITEM_EXITED), HttpStatus.BAD_REQUEST);
                }
            } else {
                responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e) {
            responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @Override
    public ResponseEntity<?> getWishListByNameAndUser(Principal connectedUser, String wishListName, Pageable pageable) {
        ResponseEntity<?> responseEntity = null;
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            if (user != null) {
                List<ServiceByWishList> wishList = wishListRepository.getAllWishListByNameAndUser(wishListName, user.getId(), pageable);
                responseEntity = new ResponseEntity<>(wishList, HttpStatus.OK);
            }

        } catch (Exception ex) {
            responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }

    @Override
    public ResponseEntity<?> deleteWishListItem(Long wishListItemId) {
        ResponseEntity<?> responseEntity = null;
        try {
            Optional<WishlistItemEntity> wishlistItem = wishListItemRepository.findById(wishListItemId);
            wishListItemRepository.deleteById(wishListItemId);
            if (wishlistItem.isPresent()) {
                List<WishlistItemEntity> wishListItems = wishListItemRepository.findAllByWishlist_WishlistId(wishlistItem.get().getWishlist().getWishlistId());
                if (wishListItems.isEmpty()) {
                    wishlistItem.ifPresent(wishlistItemEntity -> wishListRepository.deleteById(wishlistItemEntity.getWishlist().getWishlistId()));
                }
            }
            responseEntity = new ResponseEntity<>(new BaseResult(true, MessageUtil.MSG_DELETE_SUCCESS), HttpStatus.OK);

        } catch (Exception ex) {
            responseEntity = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return responseEntity;
    }
}

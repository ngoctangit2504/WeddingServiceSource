package com.wedding.backend.repository;


import com.wedding.backend.dto.customer.wishlist.ExitWishlist;
import com.wedding.backend.dto.service.ServiceByWishList;
import com.wedding.backend.entity.WishlistEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishListRepository extends JpaRepository<WishlistEntity, Long> {
    WishlistEntity findByUserWishList_IdAndWishlistName(String id, String wishlistName);

    @Query(value = "select w.wishlist_name as wishListName, wi.wishlist_item_id as wishListItem, wi.service_id as serviceId, w.user_id as userId from wishlists as w\n" +
            "inner join wishlist_items as wi\n" +
            "on w.wishlist_id = wi.wishlist_id\n" +
            "where w.wishlist_name =:wishListName and w.user_id =:userId and wi.service_id =:serviceId", nativeQuery = true)
    ExitWishlist wishListItemExit(@Param("wishListName") String wishListName, @Param("serviceId") Long serviceId, @Param("userId") String userId);

    @Query(value = "Select s.id, s.title, s.address, s.created_date as createdDate, s.price, s.image, wi.wishlist_item_id as wishListItemId\n" +
            "from services as s\n" +
            "inner join wishlist_items as wi on s.id = wi.service_id\n" +
            "inner join wishlists as w on w.wishlist_id = wi.wishlist_id\n" +
            "where w.user_id =:userId  and w.wishlist_name LIKE %:wishListName%\n" +
            "group by s.id, s.title, s.address, s.created_date, s.price, s.image, wi.wishlist_item_id \n" +
            "order by wi.wishlist_item_id desc", nativeQuery = true)
    List<ServiceByWishList> getAllWishListByNameAndUser(@Param("wishListName") String wishListName, @Param("userId") String userId, Pageable pageable);
}
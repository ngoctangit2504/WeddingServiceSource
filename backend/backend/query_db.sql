
-- Find service is exit in wishlist
select w.wishlist_name as wishListName, wi.wishlist_item_id as wishListItem, wi.service_id as serviceId, w.user_id as userId from wishlists as w
inner join wishlist_items as wi
on w.wishlist_id = wi.wishlist_id
where w.wishlist_name = 'service' and w.user_id = '08ce75edefd446159f4f590cb78977ca' and wi.service_id = 1;


Select s.id, s.title, s.address, s.created_date as createdDate, s.price, s.image, wi.wishlist_item_id as wishListItemId
from services as s
inner join wishlist_items as wi on s.id = wi.service_id
inner join wishlists as w on w.wishlist_id = wi.wishlist_id
where w.user_id = '08ce75edefd446159f4f590cb78977ca'  and w.wishlist_name LIKE 'service'
group by s.id, s.title, s.address, s.created_date, s.price, s.image, wi.wishlist_item_id 
order by wi.wishlist_item_id desc;

  
  
-- Detail service
	Select s.id, li.image_url_list as imagesURL, sa.name as nameAlb from services as s
                    inner join service_albums as sa on s.id = sa.service_id
                    inner join service_album_entity_image_url_list as li on sa.id = li.service_album_entity_id
                    where s.id= 1 ;
  
ALTER TABLE `wedding_db`.`services`
    CHANGE COLUMN `id` `id` BIGINT NOT NULL AUTO_INCREMENT FIRST,
    CHANGE COLUMN `title` `title` VARCHAR(255) NOT NULL AFTER `id`,
    CHANGE COLUMN `address` `address` VARCHAR(255) NULL DEFAULT NULL AFTER `title`,
    CHANGE COLUMN `image` `image` VARCHAR(255) NULL DEFAULT NULL AFTER `address`,
    CHANGE COLUMN `price` `price` DECIMAL(38,2) NULL DEFAULT NULL AFTER `image`,
    CHANGE COLUMN `information` `information` TEXT CHARACTER SET 'utf8mb4' COLLATE 'utf8mb4_unicode_ci' NULL DEFAULT NULL AFTER `price`,
    CHANGE COLUMN `supplier_id` `supplier_id` BIGINT NULL DEFAULT NULL AFTER `information`,
    CHANGE COLUMN `service_type_id` `service_type_id` BIGINT NULL DEFAULT NULL AFTER `supplier_id`;


-- Query select all supplier (conditional)
Select * from supplier;
UPDATE `wedding_db`.`supplier` SET `is_deleted` = 'false' WHERE (`id` = '1');

-- Get services by supplier
select * from services as s 
inner join supplier as sup on s.supplier_id = sup.id
inner join users as u on u.id = sup.user_id


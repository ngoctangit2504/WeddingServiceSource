package com.wedding.backend.repository;

import com.wedding.backend.common.StatusCommon;
import com.wedding.backend.dto.service.ImageAlbDTO;
import com.wedding.backend.dto.service.ServiceByPackageDTO;
import com.wedding.backend.dto.service.ServiceBySuggest;
import com.wedding.backend.dto.service.ServiceDetail;
import com.wedding.backend.entity.ServiceEntity;
import com.wedding.backend.entity.ServiceTypeEntity;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceEntity, Long> {
    List<ServiceEntity> findAllByIsDeletedFalse(Pageable pageable);

    List<ServiceEntity> findAllByServiceTypeAndIsDeletedFalse(ServiceTypeEntity serviceType, Pageable pageable);

    @Query(
            value = "SELECT sv.id as serviceId, sv.title, sv.address as addressService, sv.image, sv.information, sv.link_facebook as linkFacebook, sv.link_website as linkWebsite, sv.rotation, s.phone_number_supplier as phoneNumberSupplier,\n" +
                    "s.id as supplierId, s.name as supplierName, s.address_supplier as addressSupplier, s.logo, st.name as serviceTypeName\n" +
                    "FROM wedding_db.services as sv\n" +
                    "inner join supplier as s on sv.supplier_id = s.id\n" +
                    "inner join service_types st on sv.service_type_id = st.id\n" +
                    "where sv.id=:serviceId", nativeQuery = true
    )
    ServiceDetail serviceDetailById(@Param("serviceId") Long serviceId);


    List<ServiceEntity> findAllBySupplier_IdAndIsDeletedFalse(Pageable pageable, Long supplierId);


    @Query(
            value = "Select s.id, li.image_url_list as imagesURL, sa.name as nameAlb from services as s\n" +
                    "inner join service_albums as sa on s.id = sa.service_id\n" +
                    "inner join service_album_entity_image_url_list as li on sa.id = li.service_album_entity_id\n" +
                    "where s.id=:serviceId and sa.name like :albName", nativeQuery = true)
    List<ImageAlbDTO> imagesOfAlbum(@Param("serviceId") Long serviceId, @Param("albName") String albName);

    @Query(
            value = "WITH RankedServices AS (\n" +
                    "    SELECT \n" +
                    "        s.id, \n" +
                    "        s.title, \n" +
                    "        s.image, \n" +
                    "        s.address, \n" +
                    "        s.created_date as  createdDate, \n" +
                    "        t.purchase_date as purchaseDate,\n" +
                    "        s.supplier_id as supplierId,\n" +
                    "        ROW_NUMBER() OVER (PARTITION BY s.supplier_id ORDER BY s.created_date DESC) AS rn\n" +
                    "    FROM services AS s\n" +
                    "    INNER JOIN supplier AS sup ON s.supplier_id = sup.id\n" +
                    "    INNER JOIN transaction AS t ON t.supplier_id = sup.id\n" +
                    "    WHERE t.package_id =:packageId \n" +
                    "      AND s.status = 'APPROVED' \n" +
                    "      AND s.is_deleted = FALSE and s.is_selected = true and t.expired = false\n" +
                    ")\n" +
                    "SELECT *\n" +
                    "FROM RankedServices\n" +
                    "WHERE rn <= 5\n" +
                    "ORDER BY purchaseDate DESC", nativeQuery = true
    )
    List<ServiceByPackageDTO> serviceByPackageId(@Param("packageId") Long packageId, Pageable pageable);

    @Query(
            value = "WITH RankedServices AS (\n" +
                    "    SELECT \n" +
                    "        s.id, \n" +
                    "        s.title, \n" +
                    "        s.image, \n" +
                    "        s.address, \n" +
                    "        s.created_date AS createdDate, \n" +
                    "        t.purchase_date AS purchaseDate,\n" +
                    "        s.supplier_id AS supplierId,\n" +
                    "        t.package_id AS packageId,\n" +
                    "        ROW_NUMBER() OVER (PARTITION BY s.supplier_id ORDER BY s.created_date DESC) AS rn\n" +
                    "    FROM services AS s\n" +
                    "    INNER JOIN supplier AS sup ON s.supplier_id = sup.id\n" +
                    "    INNER JOIN transaction AS t ON t.supplier_id = sup.id\n" +
                    "    WHERE (t.package_id = 1 OR t.package_id = 2)\n" +
                    "      AND s.status = 'APPROVED' \n" +
                    "      AND s.is_deleted = FALSE \n" +
                    "      AND s.is_selected = TRUE \n" +
                    "      AND t.expired = FALSE\n" +
                    ")\n" +
                    "SELECT *\n" +
                    "FROM RankedServices\n" +
                    "WHERE rn <= 5\n" +
                    "ORDER BY \n" +
                    "    packageId DESC,\n" +
                    "    CASE\n" +
                    "        WHEN packageId = 2 THEN purchaseDate\n" +
                    "        ELSE NULL\n" +
                    "    END ASC,        \n" +
                    "    supplierId", nativeQuery = true
    )
    List<ServiceByPackageDTO> serviceByPackageId(Pageable pageable);


    @Query(
            value = "WITH ServicesWithAverageRating AS (\n" +
                    "    SELECT \n" +
                    "        s.id,\n" +
                    "        s.title,\n" +
                    "        s.image,\n" +
                    "        s.address,\n" +
                    "        s.created_date,\n" +
                    "        sup.id as supplierId,\n" +
                    "        AVG(r.star_point) as averageRating\n" +
                    "    FROM \n" +
                    "        user_supplier_follow AS fl\n" +
                    "    INNER JOIN \n" +
                    "        supplier AS sup ON fl.supplier_id = sup.id\n" +
                    "    INNER JOIN \n" +
                    "        services AS s ON sup.id = s.supplier_id\n" +
                    "    LEFT JOIN \n" +
                    "        ratings r ON s.id = r.service_id\n" +
                    "    WHERE \n" +
                    "        fl.user_id =:userId\n" +
                    "        AND s.status = 'APPROVED'\n" +
                    "        AND s.is_deleted = FALSE\n" +
                    "    GROUP BY \n" +
                    "        s.id, s.title, s.image, s.address, s.created_date, sup.id\n" +
                    "),\n" +
                    "RankedFollowedServices AS (\n" +
                    "    SELECT \n" +
                    "        id,\n" +
                    "        title,\n" +
                    "        image,\n" +
                    "        address,\n" +
                    "        created_date,\n" +
                    "        supplierId,\n" +
                    "        averageRating,\n" +
                    "        ROW_NUMBER() OVER (PARTITION BY supplierId ORDER BY created_date DESC) AS rn\n" +
                    "    FROM \n" +
                    "        ServicesWithAverageRating\n" +
                    ")\n" +
                    "SELECT \n" +
                    "    id, \n" +
                    "    title, \n" +
                    "    image, \n" +
                    "    address, \n" +
                    "    created_date  as createdDate,\n" +
                    "    averageRating\n" +
                    "FROM \n" +
                    "    RankedFollowedServices\n" +
                    "WHERE \n" +
                    "    rn <= 4\n" +
                    "ORDER BY \n" +
                    "    supplierId, createdDate DESC\n", nativeQuery = true
    )
    List<ServiceBySuggest> serviceByUserFollowingSupplier(@Param("userId") String userId, Pageable pageable);


    @Query(
            value = "Select p.id, p.title, p.address, p.created_date as createdDate, p.image, AVG(r.star_point) as averageRating\n" +
                    "from services p\n" +
                    "left join ratings r on p.id = r.service_id\n" +
                    "where p.status like 'Approved' and p.is_deleted = false\n" +
                    "group by p.id\n" +
                    "Order by averageRating desc", nativeQuery = true
    )
    List<ServiceBySuggest> serviceByAverageRating(Pageable pageable);


    @Query(value = "SELECT Month(t.purchase_date) as month, SUM(sp.price) as tolalPrice \n" +
            "FROM transaction as t inner join service_package as sp\n" +
            "where t.package_id = sp.id\n" +
            "GROUP BY MONTH(t.purchase_date)\n" +
            "Order by month(t.purchase_date)", nativeQuery = true)
    List<Object[]> getTotalPaymentServiceByMonth();

    Long countByIsDeletedFalse();

    Long countByStatus(StatusCommon status);

    Long countByIsDeletedFalseAndStatus(StatusCommon status);

    Long countBySupplier_IdAndIsSelected(Long supplierId, boolean selected);

}

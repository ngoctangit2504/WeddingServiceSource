package com.wedding.backend.repository;

import com.wedding.backend.dto.service.ImageAlbDTO;
import com.wedding.backend.dto.service.ServiceByPackageDTO;
import com.wedding.backend.dto.service.ServiceDTO;
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
            value = "SELECT sv.id as serviceId, sv.title, sv.address as addressService, sv.image, sv.information, sv.link_facebook as linkFacebook, sv.link_website as linkWebsite, sv.phone_number as phoneNumberService, sv.rotation,\n" +
                    "s.id as supplierId, s.name as supplierName, s.address_supplier as addressSupplier, s.logo, st.name as serviceTypeName\n" +
                    "FROM wedding_db.services as sv\n" +
                    "inner join supplier as s on sv.supplier_id = s.id\n" +
                    "inner join service_types st on sv.service_type_id = st.id\n" +
                    "where sv.id=:serviceId", nativeQuery = true
    )
    ServiceDetail serviceDetailById(@Param("serviceId") Long serviceId);


    List<ServiceEntity> findAllBySupplier_Id(Pageable pageable, Long supplierId );

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
                "      AND s.is_deleted = FALSE\n" +
                ")\n" +
                "SELECT *\n" +
                "FROM RankedServices\n" +
                "WHERE rn <= 5\n" +
                "ORDER BY supplierId, purchaseDate DESC", nativeQuery = true
    )
    List<ServiceByPackageDTO> serviceByPackageId(@Param("packageId") Long packageId, Pageable pageable);
}

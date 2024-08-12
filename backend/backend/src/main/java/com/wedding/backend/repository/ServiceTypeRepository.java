package com.wedding.backend.repository;

import com.wedding.backend.dto.supplier.ServiceTypeBySupplier;
import com.wedding.backend.entity.ServiceTypeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceTypeRepository extends JpaRepository<ServiceTypeEntity, Long> {
    ServiceTypeEntity findByName(String typeName);

    @Query(
            value = "SELECT \n" +
                    "    st.id as serviceTypeId, \n" +
                    "    st.name AS serviceTypeName,\n" +
                    "    COUNT(*) AS serviceCount\n" +
                    "FROM supplier s JOIN services sv ON s.id = sv.supplier_id\n" +
                    "JOIN service_types st ON sv.service_type_id = st.id\n" +
                    "where s.id =:supplierId\n" +
                    "GROUP BY st.id, st.name\n" +
                    "ORDER BY st.id, st.name;", nativeQuery = true
    )
    List<ServiceTypeBySupplier> serviceTypeNameBySupplier(@Param("supplierId") Long supplierId);
}

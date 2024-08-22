package com.wedding.backend.service.impl.service;


import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.service.ServiceDTO;
import com.wedding.backend.entity.ServiceTypeEntity;
import com.wedding.backend.repository.ServiceTypeRepository;
import com.wedding.backend.service.IService.service.IDatabaseSearch;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Optional;

@Service
public class DatabaseSearch implements IDatabaseSearch {
    @Autowired
    private ServiceTypeRepository repository;


    @Override
    public BaseResultWithDataAndCount<List<ServiceDTO>> searchFilter(Pageable pageable, LinkedHashMap<String, Object> map) throws SQLException {
        String url = "jdbc:mysql://localhost:3306/wedding_db";
        String username = "root";
        String password = "huuthang";
        String tableName = "services";
        String tableJoin = "supplier";

        //TODO: If Filter By Service Type Name => Get Id Of Service Type
        if (!map.isEmpty() && map.containsKey("service_type")) {
            Long serviceTypeId = repository.findByName((String) map.get("service_type")).getId();
            map.put("service_type_id", serviceTypeId);
            map.remove("service_type");
        }

        final Connection connection = DriverManager.getConnection(url, username, password);
        StringBuilder filterQuery = new StringBuilder();
        StringBuilder totalResultQuery = new StringBuilder();
        totalResultQuery.append("SELECT count(*) as total FROM ").append(tableName)
                .append(" inner join supplier as sup on services.supplier_id = sup.id")
                .append(" where services.is_deleted = false ");
        filterQuery.append("Select s.id, s.title, s.image, s.address, s.is_deleted, s.status, s.service_type_id, s.created_date, s.is_selected, sup.name, sup.id")
                .append(" from services s")
                .append(" inner join supplier as sup on s.supplier_id = sup.id")
                .append(" where s.is_deleted = false");
        int count = 0;
        if (!map.isEmpty()) {
            totalResultQuery.append(" AND ");
            filterQuery.append(" AND ");
            for (String key : map.keySet()) {
                if (count > 0) {
                    filterQuery.append(" AND ");
                    totalResultQuery.append(" AND ");
                }
                switch (key) {
                    case "supplier_id" -> {
                        filterQuery.append("s.supplier_id = ?");
                        totalResultQuery.append("supplier_id = ?");
                    }
                    case "acreage" -> {
                        filterQuery.append("acreage BETWEEN ? AND ?");
                        totalResultQuery.append("acreage BETWEEN ? AND ?");
                    }
                    default -> {
                        if (map.get(key) instanceof String) {
                            filterQuery.append(key).append(" LIKE ?");
                            totalResultQuery.append(key).append(" LIKE ?");
                        } else if (map.get(key) instanceof Number) {
                            filterQuery.append(key).append(" = ?");
                            totalResultQuery.append(key).append(" = ?");
                        }
                    }
                }
                count++;
            }
        }

        // Use Group By on filter query
        filterQuery.append(" group by s.id, s.title, s.image, s.address, s.is_deleted, s.status, s.service_type_id, s.created_date, s.is_selected, sup.name, sup.id");

        //Order by Created data DESC

        filterQuery.append(" order by s.created_date DESC");

        // Use Pageable to determine limit and offset
        filterQuery.append(" LIMIT ? OFFSET ?");

        System.out.println(filterQuery);
        System.out.println(totalResultQuery);

        // Prepare the statement and pass the search parameter values
        PreparedStatement stmtToFilter = connection.prepareStatement(filterQuery.toString());
        PreparedStatement stmtToTotalResult = connection.prepareStatement(totalResultQuery.toString());
        int parameterIndex = 0;
        if (!map.isEmpty()) {
            for (String key : map.keySet()) {
                if (map.get(key) instanceof int[]) {
                    int[] range = (int[]) map.get(key);
                    if (range.length >= 2) {
                        stmtToFilter.setObject(parameterIndex + 1, range[0]);
                        stmtToFilter.setObject(parameterIndex + 2, range[1]);

                        stmtToTotalResult.setObject(parameterIndex + 1, range[0]);
                        stmtToTotalResult.setObject(parameterIndex + 2, range[1]);
                    }
                    parameterIndex += 2;
                } else {
                    if (map.get(key) instanceof String) {
                        stmtToFilter.setString(parameterIndex + 1, "%" + map.get(key) + "%");

                        stmtToTotalResult.setString(parameterIndex + 1, "%" + map.get(key) + "%");
                    } else if (map.get(key) instanceof Number) {
                        stmtToFilter.setObject(parameterIndex + 1, map.get(key));

                        stmtToTotalResult.setObject(parameterIndex + 1, map.get(key));
                    }
                    parameterIndex++;
                }
            }
        }

        stmtToFilter.setInt(parameterIndex + 1, pageable.getPageSize());
        stmtToFilter.setLong(parameterIndex + 2, pageable.getOffset());
        System.out.println(stmtToFilter);
        System.out.println(stmtToTotalResult);

//        getTotalResult
        int totalCount = 0;
        try (ResultSet countResultSet = stmtToTotalResult.executeQuery()) {
            if (countResultSet.next()) {
                totalCount = countResultSet.getInt(1);
            }
        }

        System.out.println(totalCount);

        List<ServiceDTO> serviceDTO = new ArrayList<>();
        try (ResultSet rs = stmtToFilter.executeQuery()) {
            while (rs.next()) {
                ServiceDTO postDtoWithFilter = new ServiceDTO();
                postDtoWithFilter.setId(rs.getLong("id"));
                postDtoWithFilter.setTitle(rs.getString("title"));
                postDtoWithFilter.setAddress(rs.getString("address"));
                postDtoWithFilter.setCreatedDate(rs.getDate("created_date"));
                postDtoWithFilter.setDeleted(rs.getBoolean("is_deleted"));
                postDtoWithFilter.setStatus(rs.getString("status"));
                postDtoWithFilter.setImage(rs.getString("image"));
                postDtoWithFilter.setSelected(rs.getBoolean("is_selected"));
                Optional<ServiceTypeEntity> serviceType = repository.findById(rs.getLong("service_type_id"));
                serviceType.ifPresent(postDtoWithFilter::setServiceType);
                serviceDTO.add(postDtoWithFilter);
            }
        }

        BaseResultWithDataAndCount<List<ServiceDTO>> result = new BaseResultWithDataAndCount<>();
        result.setCount((long) totalCount);
        result.setData(new ArrayList<>(serviceDTO));
        return result;
    }
}

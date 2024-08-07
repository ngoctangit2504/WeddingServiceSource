package com.wedding.backend.service.IService.service;

import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.service.ServiceDTO;
import org.springframework.data.domain.Pageable;

import java.sql.SQLException;
import java.util.LinkedHashMap;
import java.util.List;

public interface IDatabaseSearch {
    BaseResultWithDataAndCount<List<ServiceDTO>> searchFilter(Pageable pageable, LinkedHashMap<String, Object> map) throws SQLException;
}

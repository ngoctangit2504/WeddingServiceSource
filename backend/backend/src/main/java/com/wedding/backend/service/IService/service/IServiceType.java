package com.wedding.backend.service.IService.service;

import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.service.ServiceTypeDTO;

import java.util.List;

public interface IServiceType {
    BaseResultWithDataAndCount<List<ServiceTypeDTO>> getAllServiceType();
}

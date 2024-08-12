package com.wedding.backend.mapper;

import com.wedding.backend.dto.report.ReportDto;
import com.wedding.backend.entity.ReportEntity;
import org.mapstruct.DecoratedWith;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
@DecoratedWith(ReportMapperDecorator.class)
public interface ReportMapper {
    @Mapping(target = "reportId", source = "id")
    ReportDto entityToDto(ReportEntity reportEntity);

    @Mapping(target = "id", source = "reportId")
    ReportEntity dtoToEntity(ReportDto postTypeDto);
}

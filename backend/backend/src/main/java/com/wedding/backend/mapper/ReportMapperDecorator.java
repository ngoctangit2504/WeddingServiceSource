package com.wedding.backend.mapper;


import com.wedding.backend.dto.report.ReportDto;
import com.wedding.backend.entity.ReportEntity;
import com.wedding.backend.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;

public abstract class ReportMapperDecorator implements ReportMapper {

    @Autowired
    @Qualifier("delegate")
    private ReportMapper delegate;

    @Autowired
    private ServiceRepository repository;

    @Override
    public ReportDto entityToDto(ReportEntity reportEntity) {
        ReportDto reportDto = delegate.entityToDto(reportEntity);
        reportDto.setIdOfPost(reportEntity.getServicesReport().getId());
        return reportDto;
    }

    @Override
    public ReportEntity dtoToEntity(ReportDto reportDto) {
        ReportEntity reportEntity = delegate.dtoToEntity(reportDto);
        if (reportDto.getIdOfPost() != null) {
            reportEntity.setServicesReport(repository.findById(reportDto.getIdOfPost()).orElse(null));
        }
        return reportEntity;
    }

}

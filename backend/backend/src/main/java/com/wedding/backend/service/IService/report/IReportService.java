package com.wedding.backend.service.IService.report;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.dto.report.ReportDto;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface IReportService {
    BaseResult addReport(ReportDto reportDto);

    List<ReportDto> getAllReportByPostId(Long postId);

    void deleteReportById(Long[] reportId);

    ResponseEntity<?> getAllReport(Pageable pageable);

    ResponseEntity<?> deleteReportByIds(Long[] reportId);
}

package com.wedding.backend.service.impl.report;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.report.ReportDto;
import com.wedding.backend.mapper.ReportMapper;
import com.wedding.backend.repository.ReportRepository;
import com.wedding.backend.service.IService.report.IReportService;
import com.wedding.backend.util.message.MessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReportService implements IReportService {
    @Autowired
    private ReportRepository repository;

    @Autowired
    private ReportMapper reportMapper;

    @Override
    public BaseResult addReport(ReportDto reportDto) {
        try {
            reportDto.setCreatedDate(new Date());
            reportMapper.entityToDto(repository.save(reportMapper.dtoToEntity(reportDto)));
            return new BaseResult(true, MessageUtil.ADD_REPORT_SUCCESS);
        } catch (Exception ex) {
            return new BaseResult(false, ex.getMessage());
        }
    }

    @Override
    public List<ReportDto> getAllReportByPostId(Long postId) {
        return repository.getAllByServicesReport_Id(postId).stream().map(reportEntity -> reportMapper.entityToDto(reportEntity)).collect(Collectors.toList());
    }

    @Override
    public void deleteReportById(Long[] reportId) {
        for (Long item : reportId
        ) {
            repository.deleteById(item);
        }
    }

    @Override
    public ResponseEntity<?> getAllReport(Pageable pageable) {
        ResponseEntity<?> response = null;
        BaseResultWithDataAndCount<List<ReportDto>> resultWithDataAndCount = new BaseResultWithDataAndCount<>();
        try {
            List<ReportDto> reportDtos = repository.findAll(pageable)
                    .stream()
                    .map(reportEntity -> reportMapper.entityToDto(reportEntity))
                    .collect(Collectors.toList());
            Long count = repository.count();
            resultWithDataAndCount.set(reportDtos, count);
            response = new ResponseEntity<>(resultWithDataAndCount, HttpStatus.OK);
        } catch (Exception ex) {
            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }

    @Override
    public ResponseEntity<?> deleteReportByIds(Long[] reportId) {
        ResponseEntity<?> response = null;
        try {
            for (Long item : reportId
            ) {
                repository.deleteById(item);
                response = new ResponseEntity<>(new BaseResult(true, MessageUtil.MSG_DELETE_SUCCESS), HttpStatus.OK);
            }
        } catch (Exception ex) {
            response = new ResponseEntity<>(new BaseResult(false, MessageUtil.MSG_SYSTEM_ERROR), HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return response;
    }
}

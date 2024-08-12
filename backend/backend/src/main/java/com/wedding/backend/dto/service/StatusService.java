package com.wedding.backend.dto.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusService {
    private Long percentApproved;
    private Long percentRejected;
    private Long percentReview;
}

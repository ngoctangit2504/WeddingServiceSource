package com.wedding.backend.service.IService.customer;


import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.dto.customer.rating.AverageRatingPoint;
import com.wedding.backend.dto.customer.rating.RatingDto;

import java.security.Principal;
import java.util.List;

public interface IRatingService {
    BaseResult saveNewRating(RatingDto ratingDto, Principal connectedUser);

    BaseResult updateRating(Long ratingId, RatingDto ratingDto);

    BaseResultWithData<List<RatingDto>> getAllRatingByPost(Long postId);

    BaseResultWithData<AverageRatingPoint> getGroupRatingByPost(Long postId);

    BaseResult deleteRating(Long ratingId);
}

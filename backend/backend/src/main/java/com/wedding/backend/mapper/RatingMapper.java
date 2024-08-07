package com.wedding.backend.mapper;

import com.wedding.backend.dto.customer.rating.RatingDto;
import com.wedding.backend.entity.RatingEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface RatingMapper {
    @Mapping(target = "ratingId", source = "id")
    RatingDto entityToDTO(RatingEntity ratingEntity);

    @Mapping(target = "id", source = "ratingId")
    RatingEntity dtoToEntity(RatingDto likePostDTO);
    RatingEntity updateRating(@MappingTarget RatingEntity oldRating, RatingEntity newRating);

}

package com.wedding.backend.dto.customer.rating;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.wedding.backend.entity.ServiceEntity;
import com.wedding.backend.entity.UserEntity;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Data
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RatingDto {
    private Long ratingId;
    private Long postId;
    private double starPoint;
}

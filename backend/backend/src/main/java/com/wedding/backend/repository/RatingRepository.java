package com.wedding.backend.repository;

import com.wedding.backend.dto.customer.rating.RatingWithGroup;
import com.wedding.backend.entity.RatingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public interface RatingRepository extends JpaRepository<RatingEntity, Long> {
    List<RatingEntity> getRatingEntitiesByServiceRating_Id(Long postId);

    @Query(value = "SELECT star_point as starPoint, COUNT(*) as count\n" +
            "FROM ratings\n" +
            "WHERE service_id =:postId\n" +
            "GROUP BY star_point order by star_point desc", nativeQuery = true)
    List<RatingWithGroup> getGroupRatingByPostId(@Param("postId") Long postId);
}

package com.wedding.backend.service.impl.customer;

import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithData;
import com.wedding.backend.dto.customer.rating.AverageRatingPoint;
import com.wedding.backend.dto.customer.rating.RatingDto;
import com.wedding.backend.dto.customer.rating.RatingWithGroup;
import com.wedding.backend.entity.RatingEntity;
import com.wedding.backend.entity.ServiceEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.mapper.RatingMapper;
import com.wedding.backend.repository.RatingRepository;
import com.wedding.backend.repository.ServiceRepository;
import com.wedding.backend.service.IService.customer.IRatingService;
import com.wedding.backend.util.message.MessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
public class RatingService implements IRatingService {
    @Autowired
    RatingRepository ratingRepository;

    @Autowired
    ServiceRepository serviceRepository;

    @Autowired
    RatingMapper ratingMapper;

    @Override
    public BaseResult saveNewRating(RatingDto ratingDto, Principal connectedUser) {
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            List<RatingEntity> ratings = ratingRepository.getRatingEntitiesByServiceRating_Id(ratingDto.getPostId());
            for (RatingEntity item : ratings
            ) {
                if (item.getUserRating().getId().equals(user.getId())) {
//                TODO: Process if user was rating
                    return new BaseResult(false, "Người dùng đã đánh giá");
                }
            }
            RatingEntity dataToInsertDB = new RatingEntity();
            dataToInsertDB = ratingMapper.dtoToEntity(ratingDto);
            Optional<ServiceEntity> service = serviceRepository.findById(ratingDto.getPostId());
            if (service.isPresent()) {
                dataToInsertDB.setServiceRating(service.get());
            }
            dataToInsertDB.setUserRating(user);
            ratingRepository.save(dataToInsertDB);
            return new BaseResult(true, MessageUtil.MSG_ADD_SUCCESS);
        } catch (Exception ex) {
            return new BaseResult(false, ex.getMessage());
        }
    }

    @Override
    public BaseResult updateRating(Long ratingId, RatingDto ratingDto) {
        try {
            Optional<RatingEntity> oldRating = ratingRepository.findById(ratingId);
            if (oldRating.isPresent()) {
                oldRating.get().setStarPoint(ratingDto.getStarPoint());
                ratingRepository.save(oldRating.get());
                return new BaseResult(true, MessageUtil.MSG_UPDATE_SUCCESS);
            }
            return new BaseResult(false, "Update failed!");
        } catch (Exception ex) {
            return new BaseResult(false, ex.getMessage());
        }
    }

    @Override
    public BaseResultWithData<List<RatingDto>> getAllRatingByPost(Long postId) {
        BaseResultWithData<List<RatingDto>> result = new BaseResultWithData<>();
        try {
            List<RatingDto> resultFromDb = ratingRepository.getRatingEntitiesByServiceRating_Id(postId)
                    .stream()
                    .map(likePostEntity -> ratingMapper.entityToDTO(likePostEntity))
                    .toList();
            result.Set(true, "", resultFromDb);
        } catch (Exception ex) {
            result.Set(false, ex.getMessage(), null);
        }
        return result;
    }

    @Override
    public BaseResultWithData<AverageRatingPoint> getGroupRatingByPost(Long postId) {
        BaseResultWithData<AverageRatingPoint> result = new BaseResultWithData<>();
        AverageRatingPoint averageRatingPoint = new AverageRatingPoint();
        try {
            List<RatingWithGroup> ratingWithGroups = ratingRepository.getGroupRatingByPostId(postId);
            convertRatingToAverageRating(averageRatingPoint, ratingWithGroups);
            result.Set(true, "", averageRatingPoint);
        } catch (Exception ex) {
            result.Set(false, ex.getMessage(), null);
        }
        return result;
    }

    @Override
    public BaseResult deleteRating(Long ratingId) {
        try {
            ratingRepository.deleteById(ratingId);
            return new BaseResult(true, MessageUtil.MSG_DELETE_SUCCESS);
        } catch (Exception ex) {
            return new BaseResult(false, ex.getMessage());
        }
    }

    /**
     * Func to convert data from db to object class
     */
    private void convertRatingToAverageRating(AverageRatingPoint averageRatingPoint, List<RatingWithGroup> ratingWithGroups) {
        double totalRating = 0;
        double totalCount = 0;
        for (RatingWithGroup item : ratingWithGroups
        ) {
            totalRating += item.getStarPoint() * item.getCount();
            totalCount += item.getCount();
        }
        double averageRating = ratingWithGroups.isEmpty() ? 0 : totalRating / totalCount;

        averageRatingPoint.setAverageStarPoint(averageRating);
        averageRatingPoint.setDetail(ratingWithGroups);
    }
}

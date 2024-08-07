package com.wedding.backend.service.impl.customer;


import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.common.ModelCommon;
import com.wedding.backend.dto.customer.comment.CommentPostDto;
import com.wedding.backend.dto.user.PartUser;
import com.wedding.backend.entity.CommentEntity;
import com.wedding.backend.entity.ServiceEntity;
import com.wedding.backend.entity.UserEntity;
import com.wedding.backend.exception.ResourceNotFoundException;
import com.wedding.backend.mapper.CommentMapper;
import com.wedding.backend.repository.CommentRepository;
import com.wedding.backend.repository.RoleRepository;
import com.wedding.backend.repository.ServiceRepository;
import com.wedding.backend.repository.UserRepository;
import com.wedding.backend.service.IService.customer.ICommentService;
import com.wedding.backend.util.message.MessageUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class CommentService implements ICommentService {
    @Autowired
    CommentRepository commentRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ServiceRepository serviceRepository;
    @Autowired
    CommentMapper commentMapper;
    @Autowired
    RoleRepository roleRepository;

    @Override
    public BaseResult saveNewComment(CommentPostDto commentPostDTO, Principal connectedUser) {
        BaseResult result;
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            Optional<ServiceEntity> service = serviceRepository.findById(commentPostDTO.getCommentPostId());
            service.ifPresent(commentPostDTO::setServiceComment);
            commentPostDTO.setUserComment(user);
            commentPostDTO.setStatus(true);
            commentRepository.save(commentMapper.dtoToEntity(commentPostDTO));
            result = BaseResult.builder()
                    .success(true)
                    .message(MessageUtil.MSG_ADD_SUCCESS)
                    .build();
        } catch (Exception ex) {
            result = BaseResult.builder()
                    .success(false)
                    .message(ex.getMessage())
                    .build();
        }
        return result;
    }

    @Override
    public BaseResult updateComment(Long commentId, CommentPostDto commentPostDTO, Principal connectedUser) {
        BaseResult result;
        try {
            Optional<CommentEntity> oldComment = commentRepository.findById(commentId);
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            if (oldComment.isPresent() && user != null) {
                if (user.getId().equals(oldComment.get().getUserComment().getId())) {
                    oldComment.get().setContent(commentPostDTO.getContent());
                    commentRepository.save(oldComment.get());
                    result = BaseResult.builder()
                            .success(true)
                            .message(MessageUtil.MSG_UPDATE_SUCCESS)
                            .build();
                } else {
                    result = BaseResult.builder()
                            .success(false)
                            .message("User can't update")
                            .build();
                }
            } else {
                result = BaseResult.builder()
                        .success(false)
                        .message(MessageUtil.MSG_USER_BY_ID_NOT_FOUND)
                        .build();
            }
        } catch (Exception ex) {
            result = BaseResult.builder()
                    .success(false)
                    .message(ex.getMessage())
                    .build();
        }
        return result;
    }

    @Override
    public BaseResult deleteComment(Long commentId, Principal connectedUser) {
        try {
            var user = (UserEntity) ((UsernamePasswordAuthenticationToken) connectedUser).getPrincipal();
            Optional<CommentEntity> comment = commentRepository.findById(commentId);
            if (comment.isPresent() && user != null) {
                //TODO: Accept user commented && Admin has authorize delete
                if (comment.get().getUserComment().getId().equals(user.getId())
                        || user.getRoles().stream().anyMatch(roleEntity -> roleEntity.getName().equals(ModelCommon.ADMIN))) {
                    commentRepository.deleteById(commentId);
                    return BaseResult.builder()
                            .success(true)
                            .message(MessageUtil.MSG_DELETE_SUCCESS)
                            .build();
                } else {
                    return BaseResult.builder()
                            .success(false)
                            .message("User not have authorize")
                            .build();
                }

            } else {
                return BaseResult.builder()
                        .success(false)
                        .message(MessageUtil.MSG_USER_BY_ID_NOT_FOUND)
                        .build();
            }
        } catch (Exception ex) {
            return BaseResult.builder()
                    .success(false)
                    .message(ex.getMessage())
                    .build();
        }
    }

    @Override
    public BaseResultWithDataAndCount<List<CommentPostDto>> getAllCommentOfPost(Long postId) {
        BaseResultWithDataAndCount<List<CommentPostDto>> result = new BaseResultWithDataAndCount<>();
        try {
            // Get list comment from DB by postId = serviceId
            List<CommentPostDto> commentPostDtos = commentRepository.getCommentEntitiesByServiceComment_Id(postId)
                    .stream()
                    .map(commentEntity -> commentMapper.entityToDTO(commentEntity)).toList();

            //TODO: Loop to set UserName is "Tac Gia" if user comment is author of post
            for (CommentPostDto item : commentPostDtos
            ) {
                PartUser partUser = new PartUser();
                UserEntity user = userRepository.findById(item.getUserComment().getId()).orElseThrow();
                partUser.setUserId(user.getId());
                partUser.setUserName(user.getUserName());
                partUser.setImages(user.getProfileImage());
                partUser.setPhoneNumber(user.getPhoneNumber());
                Optional<ServiceEntity> post = serviceRepository.findById(item.getServiceComment().getId());
                if (post.isPresent()) {
                    if (item.getUserComment().getId().equals(post.get().getCreatedBy())) {
                        partUser.setUserName("Tác Giả");
                    }
                }
                item.setPartUser(partUser);
                //TODO: MAKE AGAIN
                item.setUserId(user.getId());
            }

            result.set(commentPostDtos, (long) commentPostDtos.size());
        } catch (Exception ex) {
            throw new ResourceNotFoundException(ex.getMessage());
        }
        return result;
    }
}

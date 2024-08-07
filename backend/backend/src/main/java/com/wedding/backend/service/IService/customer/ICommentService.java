package com.wedding.backend.service.IService.customer;


import com.wedding.backend.base.BaseResult;
import com.wedding.backend.base.BaseResultWithDataAndCount;
import com.wedding.backend.dto.customer.comment.CommentPostDto;

import java.security.Principal;
import java.util.List;

public interface ICommentService {
    BaseResult saveNewComment(CommentPostDto commentPostDTO, Principal connectedUser);
    BaseResult updateComment(Long commentId, CommentPostDto commentPostDTO, Principal connectedUser);
    BaseResult deleteComment(Long commentId, Principal connectedUser);
    BaseResultWithDataAndCount<List<CommentPostDto>> getAllCommentOfPost(Long postId);
}

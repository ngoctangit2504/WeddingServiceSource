package com.wedding.backend.mapper;

import com.wedding.backend.dto.customer.comment.CommentPostDto;
import com.wedding.backend.entity.CommentEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CommentMapper {
    @Mapping(target = "commentPostId", source = "id")
    @Mapping(target = "createdDate", source = "createdDate")
    @Mapping(target = "modifiedDate", source = "modifiedDate")
    CommentPostDto entityToDTO(CommentEntity commentEnity);

    @Mapping(target = "id", source = "commentPostId")
    CommentEntity dtoToEntity(CommentPostDto commentPostDTO);
}

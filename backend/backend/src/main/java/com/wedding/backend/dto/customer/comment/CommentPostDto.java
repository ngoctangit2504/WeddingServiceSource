package com.wedding.backend.dto.customer.comment;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.wedding.backend.dto.user.PartUser;
import com.wedding.backend.entity.ServiceEntity;
import com.wedding.backend.entity.UserEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CommentPostDto {
    private Long commentPostId;
    private String parentComment;
    @JsonIgnore
    private UserEntity userComment;
    private String userId;
    private PartUser partUser;
    @JsonIgnore
    private ServiceEntity serviceComment;
    private String content;
    private boolean status;
    private Date createdDate;
    private Date modifiedDate;
}

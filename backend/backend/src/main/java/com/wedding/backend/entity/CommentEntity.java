package com.wedding.backend.entity;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "comments")
public class CommentEntity extends BaseEntityWithIDIncrement {
    @Column(name = "parent_comment")
    private Long parentComment;

    @Column(name = "content")
    private String content;

    @Column(name = "status")
    private boolean status;

    @JsonManagedReference
    @ManyToOne()
    @JoinColumn(name = "service_id", referencedColumnName = "id")
    private ServiceEntity serviceComment;

    @JsonManagedReference
    @ManyToOne()
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private UserEntity userComment;
}

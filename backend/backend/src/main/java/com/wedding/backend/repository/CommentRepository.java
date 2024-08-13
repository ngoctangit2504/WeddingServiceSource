package com.wedding.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Repository
@Transactional
public interface CommentRepository extends JpaRepository<CommentEntity, Long> {
    List<CommentEntity> getCommentEntitiesByServiceComment_Id(Long postId);
}

package com.wedding.backend.controller.customer;


import com.wedding.backend.dto.customer.comment.CommentPostDto;
import com.wedding.backend.service.IService.customer.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/comment")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CommentController {
    private final ICommentService service;

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGE')")
    @PostMapping("/new")
    public ResponseEntity<?> saveNewCommentPost(@RequestBody CommentPostDto commentPostDTO,
                                                Principal connectedUser) {
        return ResponseEntity.ok(service.saveNewComment(commentPostDTO, connectedUser));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCommentPost(@RequestParam(name = "commentId") Long commentId,
                                               @RequestBody CommentPostDto commentPostDTO,
                                               Principal connectedUser) {
        return ResponseEntity.ok(service.updateComment(commentId, commentPostDTO, connectedUser));
    }

    @PreAuthorize("hasAnyRole('ROLE_USER','ROLE_MANAGE','ROLE_ADMIN')")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCommentPost(@RequestParam(name = "commentId") Long commentId,
                                               Principal connectedUser) {
        return ResponseEntity.ok(service.deleteComment(commentId, connectedUser));
    }

    @GetMapping("/list/{postId}")
    public ResponseEntity<?> getAllCommentOfPost(@PathVariable(name = "postId") Long postId) {
        return ResponseEntity.ok(service.getAllCommentOfPost(postId));
    }
}

package com.wedding.backend.controller.customer;

import com.wedding.backend.dto.customer.rating.RatingDto;
import com.wedding.backend.service.IService.customer.IRatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/v1/rating")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RatingController {

    private final IRatingService ratingService;

    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    @PostMapping("/new")
    public ResponseEntity<?> saveNewRating(@RequestBody RatingDto ratingDto, Principal connectedUser) {
        return ResponseEntity.ok(ratingService.saveNewRating(ratingDto, connectedUser));
    }

    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    @PutMapping("/update")
    public ResponseEntity<?> updateRating(@RequestParam(name = "ratingId") Long ratingId,
                                          @RequestBody RatingDto ratingDto) {
        return ResponseEntity.ok(ratingService.updateRating(ratingId, ratingDto));
    }

    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteCommentPost(@RequestParam(name = "ratingId") Long ratingId) {
        return ResponseEntity.ok(ratingService.deleteRating(ratingId));
    }

    @GetMapping("/list/{postId}")
    public ResponseEntity<?> getAllRatingOfPost(@PathVariable(name = "postId") Long postId) {
        return ResponseEntity.ok(ratingService.getAllRatingByPost(postId));
    }

    @GetMapping("/list/group")
    public ResponseEntity<?> getGroupRatingOfPost(@RequestParam(name = "postId") Long postId) {
        return ResponseEntity.ok(ratingService.getGroupRatingByPost(postId));
    }
}

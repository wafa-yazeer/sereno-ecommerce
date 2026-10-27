package com.sereno.ecommerce.controller;

import com.sereno.ecommerce.dto.ApiResponse;
import com.sereno.ecommerce.model.Review;
import com.sereno.ecommerce.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@Tag(name = "Review Resource", description = "RESTful endpoints for verified customer timepiece feedback and ratings")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping
    @Operation(summary = "Get reviews", description = "List all customer reviews or filter by product ID")
    public ResponseEntity<ApiResponse<List<Review>>> getReviews(
            @RequestParam(required = false) String productId) {
        List<Review> reviews = reviewService.getReviews(productId);
        return ResponseEntity.ok(ApiResponse.ok(reviews, "Reviews retrieved"));
    }

    @PostMapping
    @Operation(summary = "Post a review (POST)", description = "Submit a verified owner review and re-compute average product rating")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Review posted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation error")
    })
    public ResponseEntity<ApiResponse<Review>> addReview(@Valid @RequestBody Review review) {
        Review created = reviewService.addReview(review);
        return new ResponseEntity<>(ApiResponse.ok(created, "Review submitted successfully"), HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a review (DELETE)", description = "Remove a review by its ID")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable String id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Review deleted"));
    }
}

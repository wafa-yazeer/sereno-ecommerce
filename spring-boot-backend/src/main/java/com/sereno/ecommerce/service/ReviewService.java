package com.sereno.ecommerce.service;

import com.sereno.ecommerce.model.Review;
import java.util.List;

public interface ReviewService {
    List<Review> getReviews(String productId);
    Review addReview(Review review);
    void deleteReview(String id);
}

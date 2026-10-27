package com.sereno.ecommerce.service;

import com.sereno.ecommerce.exception.ResourceNotFoundException;
import com.sereno.ecommerce.model.Product;
import com.sereno.ecommerce.model.Review;
import com.sereno.ecommerce.repository.ProductRepository;
import com.sereno.ecommerce.repository.ReviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;

    public ReviewServiceImpl(ReviewRepository reviewRepository, ProductRepository productRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Review> getReviews(String productId) {
        if (productId != null && !productId.isBlank()) {
            return reviewRepository.findByProductIdOrderByDateDesc(productId);
        }
        return reviewRepository.findAllByOrderByDateDesc();
    }

    @Override
    public Review addReview(Review review) {
        if (review.getId() == null || review.getId().isBlank()) {
            review.setId("rev-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (review.getDate() == null) {
            review.setDate(LocalDate.now());
        }

        Review saved = reviewRepository.save(review);

        // Recalculate product rating
        productRepository.findById(review.getProductId()).ifPresent(product -> {
            List<Review> productReviews = reviewRepository.findByProductIdOrderByDateDesc(product.getId());
            double avg = productReviews.stream().mapToInt(Review::getRating).average().orElse(5.0);
            product.setRating(Math.round(avg * 10.0) / 10.0);
            product.setReviewCount(productReviews.size());
            productRepository.save(product);
        });

        return saved;
    }

    @Override
    public void deleteReview(String id) {
        Review existing = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
        reviewRepository.delete(existing);
    }
}

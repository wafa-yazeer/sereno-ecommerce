package com.sereno.ecommerce.repository;

import com.sereno.ecommerce.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {
    List<Review> findByProductIdOrderByDateDesc(String productId);
    List<Review> findAllByOrderByDateDesc();
}

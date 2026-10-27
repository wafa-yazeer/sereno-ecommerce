package com.sereno.ecommerce.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    private String id;

    @NotBlank(message = "Product ID is required")
    @Column(name = "product_id", nullable = false)
    private String productId;

    @NotBlank(message = "Reviewer name is required")
    @Column(name = "author_name", nullable = false)
    private String author;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating cannot exceed 5")
    @Column(nullable = false)
    private Integer rating;

    @NotBlank(message = "Review title is required")
    @Column(nullable = false)
    private String title;

    @NotBlank(message = "Review comment is required")
    @Column(length = 2000, nullable = false)
    private String comment;

    @Column(name = "review_date", nullable = false)
    private LocalDate date = LocalDate.now();

    @Column(name = "verified_purchase")
    private Boolean verified = true;

    public Review() {
    }

    public Review(String id, String productId, String author, Integer rating, String title, String comment, Boolean verified) {
        this.id = id;
        this.productId = productId;
        this.author = author;
        this.rating = rating;
        this.title = title;
        this.comment = comment;
        this.verified = verified;
        this.date = LocalDate.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getProductId() {
        return productId;
    }

    public void setProductId(String productId) {
        this.productId = productId;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
}

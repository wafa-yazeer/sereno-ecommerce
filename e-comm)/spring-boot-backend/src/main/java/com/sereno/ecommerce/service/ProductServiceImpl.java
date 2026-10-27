package com.sereno.ecommerce.service;

import com.sereno.ecommerce.exception.ResourceNotFoundException;
import com.sereno.ecommerce.model.Category;
import com.sereno.ecommerce.model.Product;
import com.sereno.ecommerce.repository.CategoryRepository;
import com.sereno.ecommerce.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public ProductServiceImpl(ProductRepository productRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Product> getAllProducts(String category, String search, Double maxPrice, String sort) {
        List<Product> products = productRepository.searchProducts(category, search, maxPrice);

        if ("price_asc".equalsIgnoreCase(sort)) {
            return products.stream().sorted(Comparator.comparing(Product::getPrice)).collect(Collectors.toList());
        } else if ("price_desc".equalsIgnoreCase(sort)) {
            return products.stream().sorted(Comparator.comparing(Product::getPrice).reversed()).collect(Collectors.toList());
        } else if ("rating".equalsIgnoreCase(sort)) {
            return products.stream().sorted(Comparator.comparing(Product::getRating).reversed()).collect(Collectors.toList());
        }
        return products;
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    @Override
    @Transactional(readOnly = true)
    public Product getProductBySku(String sku) {
        return productRepository.findBySku(sku)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "SKU", sku));
    }

    @Override
    public Product createProduct(Product product) {
        if (product.getId() == null || product.getId().isBlank()) {
            product.setId("prod-" + UUID.randomUUID().toString().substring(0, 8));
        }

        if (productRepository.existsBySku(product.getSku())) {
            throw new IllegalArgumentException("A timepiece with SKU '" + product.getSku() + "' already exists");
        }

        // Attach category if given as ID or Object
        if (product.getCategory() == null && product.getCategoryId() != null) {
            Category cat = categoryRepository.findById(product.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", product.getCategoryId()));
            product.setCategory(cat);
        }

        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(String id, Product updated) {
        Product existing = getProductById(id);

        existing.setName(updated.getName());
        existing.setPrice(updated.getPrice());
        if (updated.getOriginalPrice() != null) existing.setOriginalPrice(updated.getOriginalPrice());
        existing.setStock(updated.getStock());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getDialColor() != null) existing.setDialColor(updated.getDialColor());
        if (updated.getCaseSize() != null) existing.setCaseSize(updated.getCaseSize());
        if (updated.getMovement() != null) existing.setMovement(updated.getMovement());
        if (updated.getGlass() != null) existing.setGlass(updated.getGlass());
        if (updated.getWaterResistance() != null) existing.setWaterResistance(updated.getWaterResistance());
        if (updated.getStrap() != null) existing.setStrap(updated.getStrap());
        if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl());
        if (updated.getBadge() != null) existing.setBadge(updated.getBadge());
        if (updated.getFeatured() != null) existing.setFeatured(updated.getFeatured());

        if (updated.getCategoryId() != null && !updated.getCategoryId().equals(existing.getCategoryId())) {
            Category cat = categoryRepository.findById(updated.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", updated.getCategoryId()));
            existing.setCategory(cat);
        }

        return productRepository.save(existing);
    }

    @Override
    public void deleteProduct(String id) {
        Product existing = getProductById(id);
        productRepository.delete(existing);
    }

    @Override
    public Product updateStock(String id, int quantityChange) {
        Product existing = getProductById(id);
        int newStock = existing.getStock() + quantityChange;
        if (newStock < 0) {
            throw new IllegalArgumentException("Insufficient inventory for timepiece: " + existing.getName());
        }
        existing.setStock(newStock);
        return productRepository.save(existing);
    }
}

package com.sereno.ecommerce.service;

import com.sereno.ecommerce.exception.ResourceNotFoundException;
import com.sereno.ecommerce.model.Category;
import com.sereno.ecommerce.model.Product;
import com.sereno.ecommerce.repository.CategoryRepository;
import com.sereno.ecommerce.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductServiceImpl productService;

    private Product product;
    private Category category;

    @BeforeEach
    void setUp() {
        category = new Category("cat-auto", "Automatic", "Description", "img.jpg");

        product = new Product();
        product.setId("prod-100");
        product.setName("Sereno Masterpiece");
        product.setSku("SER-MST-100");
        product.setCategory(category);
        product.setPrice(350.0);
        product.setStock(5);
    }

    @Test
    @DisplayName("getProductById - Returns product when found")
    void testGetProductByIdSuccess() {
        when(productRepository.findById("prod-100")).thenReturn(Optional.of(product));

        Product result = productService.getProductById("prod-100");

        assertNotNull(result);
        assertEquals("Sereno Masterpiece", result.getName());
        assertEquals("SER-MST-100", result.getSku());
    }

    @Test
    @DisplayName("getProductById - Throws ResourceNotFoundException when product does not exist")
    void testGetProductByIdNotFound() {
        when(productRepository.findById("non-existent")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            productService.getProductById("non-existent");
        });
    }

    @Test
    @DisplayName("createProduct - Successfully persists valid product")
    void testCreateProductSuccess() {
        when(productRepository.existsBySku("SER-MST-100")).thenReturn(false);
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product saved = productService.createProduct(product);

        assertNotNull(saved);
        assertEquals("Sereno Masterpiece", saved.getName());
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    @DisplayName("createProduct - Throws IllegalArgumentException on duplicate SKU")
    void testCreateProductDuplicateSku() {
        when(productRepository.existsBySku("SER-MST-100")).thenReturn(true);

        assertThrows(IllegalArgumentException.class, () -> {
            productService.createProduct(product);
        });

        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    @DisplayName("updateStock - Decrements inventory correctly")
    void testUpdateStockSuccess() {
        when(productRepository.findById("prod-100")).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        Product updated = productService.updateStock("prod-100", -2);

        assertEquals(3, updated.getStock());
    }

    @Test
    @DisplayName("updateStock - Throws exception if stock would become negative")
    void testUpdateStockInsufficient() {
        when(productRepository.findById("prod-100")).thenReturn(Optional.of(product));

        assertThrows(IllegalArgumentException.class, () -> {
            productService.updateStock("prod-100", -10);
        });
    }
}

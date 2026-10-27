package com.sereno.ecommerce.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sereno.ecommerce.model.Category;
import com.sereno.ecommerce.model.Product;
import com.sereno.ecommerce.service.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ProductController.class)
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    private Product testProduct;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category("cat-chrono", "Chronograph", "Test Description", "test.jpg");

        testProduct = new Product();
        testProduct.setId("prod-test-01");
        testProduct.setName("Test Chronograph");
        testProduct.setSku("TEST-SKU-001");
        testProduct.setCategory(testCategory);
        testProduct.setPrice(250.0);
        testProduct.setStock(10);
        testProduct.setDescription("A high precision test timepiece");
    }

    @Test
    @DisplayName("GET /api/products - Should return all products with 200 OK")
    void testGetAllProducts() throws Exception {
        when(productService.getAllProducts(null, null, null, null))
                .thenReturn(List.of(testProduct));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Test Chronograph"))
                .andExpect(jsonPath("$.data[0].sku").value("TEST-SKU-001"));
    }

    @Test
    @DisplayName("GET /api/products/{id} - Should return product details with 200 OK")
    void testGetProductById() throws Exception {
        when(productService.getProductById("prod-test-01")).thenReturn(testProduct);

        mockMvc.perform(get("/api/products/prod-test-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("prod-test-01"))
                .andExpect(jsonPath("$.data.price").value(250.0));
    }

    @Test
    @DisplayName("POST /api/products - Should create new product and return 201 Created")
    void testCreateProduct() throws Exception {
        when(productService.createProduct(any(Product.class))).thenReturn(testProduct);

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProduct)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Test Chronograph"));
    }

    @Test
    @DisplayName("POST /api/products - Validation failure returns 400 Bad Request")
    void testCreateProductValidationFailure() throws Exception {
        Product invalidProduct = new Product();
        invalidProduct.setName(""); // Invalid: empty name violates @NotBlank

        mockMvc.perform(post("/api/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(invalidProduct)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    @DisplayName("PUT /api/products/{id} - Should update product and return 200 OK")
    void testUpdateProduct() throws Exception {
        when(productService.updateProduct(eq("prod-test-01"), any(Product.class))).thenReturn(testProduct);

        mockMvc.perform(put("/api/products/prod-test-01")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testProduct)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Test Chronograph"));
    }

    @Test
    @DisplayName("DELETE /api/products/{id} - Should delete product and return 200 OK")
    void testDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct("prod-test-01");

        mockMvc.perform(delete("/api/products/prod-test-01"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}

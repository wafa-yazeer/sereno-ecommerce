package com.sereno.ecommerce.controller;

import com.sereno.ecommerce.dto.ApiResponse;
import com.sereno.ecommerce.model.Product;
import com.sereno.ecommerce.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@Tag(name = "Product Resource", description = "RESTful CRUD endpoints for SERENO Luxury Timepieces catalog")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @Operation(summary = "Get all products", description = "Retrieve all luxury timepieces with optional filtering by category, search query, price range, and sort order")
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts(
            @Parameter(description = "Category ID to filter by (e.g., cat-chronograph, cat-automatic, or 'all')")
            @RequestParam(required = false) String category,
            @Parameter(description = "Search term matching name, SKU, movement, or description")
            @RequestParam(required = false) String search,
            @Parameter(description = "Maximum price threshold")
            @RequestParam(required = false) Double maxPrice,
            @Parameter(description = "Sort criteria: 'price_asc', 'price_desc', or 'rating'")
            @RequestParam(required = false) String sort) {
        List<Product> products = productService.getAllProducts(category, search, maxPrice, sort);
        return ResponseEntity.ok(ApiResponse.ok(products, "Products retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get product by ID", description = "Retrieve detailed specification of a single timepiece by its unique ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product found"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found with specified ID")
    })
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable String id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.ok(product, "Product details retrieved"));
    }

    @GetMapping("/sku/{sku}")
    @Operation(summary = "Get product by SKU", description = "Lookup a timepiece by its unique stock keeping unit")
    public ResponseEntity<ApiResponse<Product>> getProductBySku(@PathVariable String sku) {
        Product product = productService.getProductBySku(sku);
        return ResponseEntity.ok(ApiResponse.ok(product, "Product retrieved by SKU"));
    }

    @PostMapping
    @Operation(summary = "Create a new timepiece (POST)", description = "Add a new luxury timepiece to the catalog. Validates required attributes like name, SKU, price, and stock.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Product created successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Validation failed or duplicate SKU")
    })
    public ResponseEntity<ApiResponse<Product>> createProduct(@Valid @RequestBody Product product) {
        Product created = productService.createProduct(product);
        return new ResponseEntity<>(ApiResponse.ok(created, "Timepiece created successfully"), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing timepiece (PUT)", description = "Update attributes of an existing timepiece by its unique identifier")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product updated successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody Product product) {
        Product updated = productService.updateProduct(id, product);
        return ResponseEntity.ok(ApiResponse.ok(updated, "Timepiece updated successfully"));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a timepiece (DELETE)", description = "Permanently remove a timepiece from the catalog by its ID")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Product deleted successfully"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Product not found")
    })
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Timepiece deleted successfully from catalog"));
    }
}

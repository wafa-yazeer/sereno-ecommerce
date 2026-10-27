package com.sereno.ecommerce.service;

import com.sereno.ecommerce.model.Product;
import java.util.List;

public interface ProductService {
    List<Product> getAllProducts(String category, String search, Double maxPrice, String sort);
    Product getProductById(String id);
    Product getProductBySku(String sku);
    Product createProduct(Product product);
    Product updateProduct(String id, Product product);
    void deleteProduct(String id);
    Product updateStock(String id, int quantityChange);
}

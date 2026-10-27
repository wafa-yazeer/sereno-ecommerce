package com.sereno.ecommerce.service;

import com.sereno.ecommerce.exception.ResourceNotFoundException;
import com.sereno.ecommerce.model.Category;
import com.sereno.ecommerce.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryServiceImpl(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Category getCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", id));
    }

    @Override
    public Category createCategory(Category category) {
        if (category.getId() == null || category.getId().isBlank()) {
            category.setId("cat-" + UUID.randomUUID().toString().substring(0, 8));
        }
        if (categoryRepository.existsByNameIgnoreCase(category.getName())) {
            throw new IllegalArgumentException("A category with the name '" + category.getName() + "' already exists");
        }
        return categoryRepository.save(category);
    }

    @Override
    public Category updateCategory(String id, Category updatedCategory) {
        Category existing = getCategoryById(id);
        existing.setName(updatedCategory.getName());
        existing.setDescription(updatedCategory.getDescription());
        if (updatedCategory.getImageUrl() != null) {
            existing.setImageUrl(updatedCategory.getImageUrl());
        }
        return categoryRepository.save(existing);
    }

    @Override
    public void deleteCategory(String id) {
        Category existing = getCategoryById(id);
        categoryRepository.delete(existing);
    }
}

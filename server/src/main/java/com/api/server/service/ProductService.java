package com.api.server.service;

import com.api.server.model.Product;
import com.api.server.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ProductService extends AbstractBaseService<Product> {
    
    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        super(productRepository);
        this.productRepository = productRepository;
    }

    @Override
    protected void validateEntity(Product product) {
        product.validate();
    }

    @Transactional
    public Product checkInStock(String productId, int quantity) {
        Product product = findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        product.setStockQuantity(product.getStockQuantity() + quantity);
        product.setLastRestockDate(LocalDateTime.now());
        return save(product);
    }

    @Transactional
    public Product checkOutStock(String productId, int quantity) {
        Product product = findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }
        
        product.setStockQuantity(product.getStockQuantity() - quantity);
        return save(product);
    }

    @Transactional
    public Product sellProduct(String productId, int quantity) {
        Product product = findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }
        
        product.setStockQuantity(product.getStockQuantity() - quantity);
        product.setLastSaleDate(LocalDateTime.now());
        return save(product);
    }

    public int getStockQuantity(String productId) {
        Product product = findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        return product.getStockQuantity();
    }

    @Transactional
    public Product updateProduct(String id, Product product) {
        return findById(id).map(existingProduct -> {
            product.setId(id);
            validateEntity(product);
            return save(product);
        }).orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
}

package com.api.server.service;

import com.api.server.model.Product;
import com.api.server.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class StockService {

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Product checkIn(String productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setStockQuantity(product.getStockQuantity() + quantity);
        product.setLastRestockDate(LocalDateTime.now());
        return productRepository.save(product);
    }

    @Transactional
    public Product checkOut(String productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        product.setStockQuantity(product.getStockQuantity() - quantity);
        return productRepository.save(product);
    }

    @Transactional
    public Product sellProduct(String productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            throw new RuntimeException("Insufficient stock");
        }

        product.setStockQuantity(product.getStockQuantity() - quantity);
        product.setLastSaleDate(LocalDateTime.now());
        return productRepository.save(product);
    }

    public int getStockQuantity(String productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return product.getStockQuantity();
    }
}

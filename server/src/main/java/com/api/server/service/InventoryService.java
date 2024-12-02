package com.api.server.service;

import com.api.server.model.Product;
import com.api.server.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InventoryService implements IStockManagement {
    
    private final ProductRepository productRepository;

    @Autowired
    public InventoryService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    @Transactional
    public Product addStock(String productId, int quantity) {
        Product product = findProductById(productId);
        product.addStock(quantity);
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product removeStock(String productId, int quantity) {
        Product product = findProductById(productId);
        if (!hasEnoughStock(productId, quantity)) {
            throw new IllegalStateException("Insufficient stock available");
        }
        product.removeStock(quantity);
        return productRepository.save(product);
    }

    @Override
    @Transactional
    public Product processStockSale(String productId, int quantity) {
        Product product = findProductById(productId);
        if (!hasEnoughStock(productId, quantity)) {
            throw new IllegalStateException("Insufficient stock available");
        }
        product.sell(quantity);
        return productRepository.save(product);
    }

    @Override
    public int getCurrentStock(String productId) {
        return findProductById(productId).getStockQuantity();
    }

    @Override
    public boolean hasEnoughStock(String productId, int quantity) {
        return getCurrentStock(productId) >= quantity;
    }

    private Product findProductById(String productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with id: " + productId));
    }
}

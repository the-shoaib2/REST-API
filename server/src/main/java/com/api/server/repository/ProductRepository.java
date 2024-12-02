package com.api.server.repository;

import com.api.server.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

// Repository for Product (Abstraction)
@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    boolean existsByName(String name);
    
}

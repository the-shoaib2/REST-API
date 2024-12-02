package com.shopping.repository;

import com.shopping.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
    // Additional custom queries can be added here

    

}

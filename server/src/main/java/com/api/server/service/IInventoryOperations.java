package com.api.server.service;

import com.api.server.model.Product;

public interface IInventoryOperations {
    Product checkInStock(String productId, int quantity);
    Product checkOutStock(String productId, int quantity);
    Product sellProduct(String productId, int quantity);
    int getStockQuantity(String productId);
}

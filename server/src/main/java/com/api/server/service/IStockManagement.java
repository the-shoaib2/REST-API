package com.api.server.service;

import com.api.server.model.Product;

public interface IStockManagement {
    Product addStock(String productId, int quantity);
    Product removeStock(String productId, int quantity);
    Product processStockSale(String productId, int quantity);
    int getCurrentStock(String productId);
    boolean hasEnoughStock(String productId, int quantity);
}

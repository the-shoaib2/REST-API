package com.api.server.controller;

import com.api.server.model.Product;
import com.api.server.service.InventoryService;
import com.api.server.service.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;

import java.util.List;

@RestController
@RequestMapping("/api/products")  // Define the base URL
public class ProductController extends AbstractBaseController<Product> {

    private final ProductService productService;
    private final InventoryService inventoryService;

    public ProductController(ProductService productService, InventoryService inventoryService) {
        super(productService);
        this.productService = productService;
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @Override
    public List<Product> getAll() {
        return super.getAll();
    }

    @PostMapping
    @Override
    public ResponseEntity<Product> create(@Valid @RequestBody Product product) {
        return super.create(product);
    }

    @GetMapping("/{id}")
    @Override
    public ResponseEntity<Product> getById(@PathVariable String id) {
        return super.getById(id);
    }

    @PutMapping("/{id}")
    @Override
    public ResponseEntity<Product> update(@PathVariable String id, @RequestBody Product product) {
        return super.update(id, product);
    }

    @DeleteMapping("/{id}")
    @Override
    public ResponseEntity<Void> delete(@PathVariable String id) {
        return super.delete(id);
    }

    @PostMapping("/{id}/stock/checkin")
    public ResponseEntity<Product> checkInStock(
            @PathVariable String id,
            @RequestParam @Positive(message = "Quantity must be positive") int quantity) {
        try {
            return ResponseEntity.ok(inventoryService.addStock(id, quantity));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/{id}/stock/checkout")
    public ResponseEntity<Product> checkOutStock(
            @PathVariable String id,
            @RequestParam @Positive(message = "Quantity must be positive") int quantity) {
        try {
            return ResponseEntity.ok(inventoryService.removeStock(id, quantity));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @PostMapping("/{id}/sell")
    public ResponseEntity<Product> sellProduct(
            @PathVariable String id,
            @RequestParam @Positive(message = "Quantity must be positive") int quantity) {
        try {
            return ResponseEntity.ok(inventoryService.processStockSale(id, quantity));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<Integer> getStockQuantity(@PathVariable String id) {
        try {
            return ResponseEntity.ok(inventoryService.getCurrentStock(id));
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}

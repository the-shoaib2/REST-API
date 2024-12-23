package com.api.server.controller;

import com.api.server.model.BaseEntity;
import org.springframework.http.ResponseEntity;
import java.util.List;

// Base controller for all controllers in the application (Abstraction)
public interface BaseController<T extends BaseEntity> {
    List<T> getAll(); //ArrayList
    ResponseEntity<T> getById(String id);
    ResponseEntity<T> create(T entity);
    ResponseEntity<T> update(String id, T entity);
    ResponseEntity<Void> delete(String id);
}

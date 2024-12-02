package com.api.server.controller;

import com.api.server.model.BaseEntity;
import com.api.server.service.BaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

public abstract class AbstractBaseController<T extends BaseEntity> implements BaseController<T> {
    
    protected final BaseService<T> service;

    protected AbstractBaseController(BaseService<T> service) {
        this.service = service;
    }

    @Override
    public List<T> getAll() {
        return service.findAll();
    }

    @Override
    public ResponseEntity<T> getById(String id) {
        return service.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Override
    public ResponseEntity<T> create(T entity) {
        try {
            T savedEntity = service.save(entity);
            return ResponseEntity.ok(savedEntity);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<T> update(String id, T entity) {
        try {
            if (!service.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            entity.setId(id);
            return ResponseEntity.ok(service.save(entity));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        }
    }

    @Override
    public ResponseEntity<Void> delete(String id) {
        try {
            if (!service.existsById(id)) {
                return ResponseEntity.notFound().build();
            }
            service.deleteById(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }
}

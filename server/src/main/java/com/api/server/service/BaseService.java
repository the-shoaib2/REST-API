package com.api.server.service;

import com.api.server.model.BaseEntity;
import java.util.List;
import java.util.Optional;

public interface BaseService<T extends BaseEntity> {
    List<T> findAll();
    Optional<T> findById(String id);
    T save(T entity);
    void deleteById(String id);
    boolean existsById(String id);
}

package com.api.server.service;

import com.api.server.model.BaseEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

// Abstract class for all services in the application(Abstraction) 

public abstract class AbstractBaseService<T extends BaseEntity> implements BaseService<T> {

    protected final MongoRepository<T, String> repository;

    // Methods Overriding (Polymorphism)
    protected AbstractBaseService(MongoRepository<T, String> repository) {
        this.repository = repository;
    }

    @Override
    public List<T> findAll() {
        return repository.findAll();
    }

    @Override
    public Optional<T> findById(String id) {
        return repository.findById(id);
    }

    @Override
    public T save(T entity) {
        validateEntity(entity);
        return repository.save(entity);
    }

    @Override
    public void deleteById(String id) {
        repository.deleteById(id);
    }

    @Override
    public boolean existsById(String id) {
        return repository.existsById(id);
    }

    protected abstract void validateEntity(T entity);
}

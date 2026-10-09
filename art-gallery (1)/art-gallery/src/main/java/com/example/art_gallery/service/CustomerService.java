package com.example.art_gallery.service;

import com.example.art_gallery.entity.Customer;
import com.example.art_gallery.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<Customer> getAllCustomers() {
        return repository.findAll();
    }

    public Customer getCustomerById(int id) {
        return repository.findById(id).orElse(null);
    }

    public Customer addCustomer(Customer customer) {
        return repository.save(customer);
    }

    public Customer updateCustomer(int id, Customer customer) {

        Customer existing = repository.findById(id).orElse(null);

        if (existing == null) {
            return null;
        }

        existing.setName(customer.getName());
        existing.setEmail(customer.getEmail());
        existing.setPhone(customer.getPhone());

        return repository.save(existing);
    }

    public void deleteCustomer(int id) {
        repository.deleteById(id);
    }
}
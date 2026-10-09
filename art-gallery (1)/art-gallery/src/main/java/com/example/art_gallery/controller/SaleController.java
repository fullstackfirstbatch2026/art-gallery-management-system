package com.example.art_gallery.controller;

import com.example.art_gallery.entity.SaleDetails;
import com.example.art_gallery.service.SaleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sales")
@CrossOrigin(origins = "http://localhost:5173")
public class SaleController {

    private final SaleService service;

    public SaleController(SaleService service) {
        this.service = service;
    }

    // Record a sale
    @PostMapping
    public String recordSale(
            @RequestParam int artworkId,
            @RequestParam int customerId,
            @RequestParam double salePrice) {

        service.recordSale(artworkId, customerId, salePrice);

        return "Sale recorded successfully";
    }

    // JOIN API
    @GetMapping("/details")
    public List<SaleDetails> getSaleDetails() {
        return service.getSaleDetails();
    }

    // Commission API
    @GetMapping("/commission/{salePrice}")
    public double calculateCommission(@PathVariable double salePrice) {
        return service.calculateCommission(salePrice);
    }
}
package com.example.art_gallery.service;

import com.example.art_gallery.entity.SaleDetails;
import com.example.art_gallery.repository.SaleRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService {

    private final EntityManager entityManager;
    private final SaleRepository saleRepository;

    public SaleService(EntityManager entityManager,
                       SaleRepository saleRepository) {
        this.entityManager = entityManager;
        this.saleRepository = saleRepository;
    }

    // Record a sale using stored procedure
    public void recordSale(int artworkId, int customerId, double salePrice) {

        StoredProcedureQuery query =
                entityManager.createStoredProcedureQuery("record_artwork_sale");

        query.registerStoredProcedureParameter(
                "p_artwork_id",
                Integer.class,
                ParameterMode.IN
        );

        query.registerStoredProcedureParameter(
                "p_customer_id",
                Integer.class,
                ParameterMode.IN
        );

        query.registerStoredProcedureParameter(
                "p_sale_price",
                Double.class,
                ParameterMode.IN
        );

        query.setParameter("p_artwork_id", artworkId);
        query.setParameter("p_customer_id", customerId);
        query.setParameter("p_sale_price", salePrice);

        query.execute();
    }

    // Get sales with artwork, artist and customer details
    public List<SaleDetails> getSaleDetails() {
        return saleRepository.getSaleDetails();
    }

    // Calculate gallery commission
    public double calculateCommission(double salePrice) {

        Object result = entityManager
                .createNativeQuery(
                        "SELECT calculate_commission(:price)"
                )
                .setParameter("price", salePrice)
                .getSingleResult();

        return ((Number) result).doubleValue();
    }
}
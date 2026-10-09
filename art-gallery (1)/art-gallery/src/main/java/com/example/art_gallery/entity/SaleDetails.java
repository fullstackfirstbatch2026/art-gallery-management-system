package com.example.art_gallery.entity;

import java.time.LocalDate;

public class SaleDetails {

    private int saleId;
    private String artwork;
    private String artist;
    private String customer;
    private LocalDate saleDate;
    private double salePrice;

    public SaleDetails() {
    }

    public SaleDetails(int saleId, String artwork, String artist,
                       String customer, LocalDate saleDate, double salePrice) {
        this.saleId = saleId;
        this.artwork = artwork;
        this.artist = artist;
        this.customer = customer;
        this.saleDate = saleDate;
        this.salePrice = salePrice;
    }

    public int getSaleId() {
        return saleId;
    }

    public String getArtwork() {
        return artwork;
    }

    public String getArtist() {
        return artist;
    }

    public String getCustomer() {
        return customer;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }

    public double getSalePrice() {
        return salePrice;
    }
}
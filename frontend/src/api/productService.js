import axios from 'axios';

const API_URL = "http://localhost:8080/api";

export const productService = {

    // Tüm ürünleri getir
    getAllProducts: () => axios.get(`${API_URL}/products`),
    // Mevcut stok durumlarını getir
    getAllStocks: () => axios.get(`${API_URL}/stocks`),
    // Kritik eşiğin altına düşen uyarıları getir
    getActiveAlerts: () => axios.get(`${API_URL}/alerts/active`),
    // Mevcut dosyanın içine ekle:
    getForecast: (productId) => axios.get(`${API_URL}/forecast/${productId}`)
};
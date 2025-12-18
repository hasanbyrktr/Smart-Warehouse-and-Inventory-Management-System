import React, { useEffect, useState } from 'react';
import { productService } from '../api/productService';

function Dashboard() {
    const [products, setProducts] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [forecast, setForecast] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        productService.getAllProducts().then(res => setProducts(res.data));
        productService.getActiveAlerts().then(res => setAlerts(res.data));
    };

    const handleForecast = (productId) => {
        productService.getForecast(productId).then(res => {
            alert(`Tahmin Sonucu:\nÜrün: ${res.data.productName}\nGünlük Kullanım: ${res.data.dailyUsageRate}\nTahmini Kalan Gün: ${res.data.estimatedDaysLeft}`);
        }).catch(err => alert("Tahmin verisi bulunamadı!"));
    };

    return (
        <div style={{ padding: '30px', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
            <h1 style={{ color: '#2c3e50' }}>🚀 Akıllı Depo Yönetim Sistemi</h1>
            
            {/* Bildirim Kartları */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flex: 1 }}>
                    <h3>Toplam Ürün</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{products.length}</p>
                </div>
                <div style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', flex: 1, borderLeft: '5px solid red' }}>
                    <h3 style={{ color: 'red' }}>Aktif Uyarılar</h3>
                    <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{alerts.length}</p>
                </div>
            </div>

            {/* Ürün Tablosu */}
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                <h2>Stok Durumu</h2>
                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #eee' }}>
                            <th>Ürün Adı</th>
                            <th>SKU</th>
                            <th>Fiyat</th>
                            <th>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '10px 0' }}>{p.name}</td>
                                <td>{p.sku}</td>
                                <td>{p.price} ₺</td>
                                <td>
                                    <button 
                                        onClick={() => handleForecast(p.id)}
                                        style={{ backgroundColor: '#3498db', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        🔮 Tahmin Et
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Dashboard;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [forecast, setForecast] = useState(null);

    const theme = {
        primary: '#2D3748', // Antrasit
        accent: '#F97316',  // Turuncu
        bg: '#F8FAFC',
        cardShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    };

    useEffect(() => {
        // 1. Toplam Ürün Sayısı için API çağrısı
        axios.get("http://localhost:8080/api/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Ürünler çekilemedi:", err));

        // 2. Kritik Uyarılar & Stok Değeri için API çağrısı
        axios.get("http://localhost:8080/api/stocks")
            .then(res => setStocks(res.data))
            .catch(err => console.error("Stoklar çekilemedi:", err));

        // 3. AI Tahminleme (Örnek Ürün ID: 1)
        axios.get("http://localhost:8080/api/forecast/1")
            .then(res => setForecast(res.data))
            .catch(err => console.log("Tahmin verisi henüz yok"));
    }, []);


    const totalValue = stocks.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0);

    const criticalStocks = stocks.filter(s => s.quantity < s.minimumQuantity);

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary, margin: 0 }}>Operasyonel Özet</h1>
                <p style={{ color: '#64748B', marginTop: '5px' }}>Depo genel durumu ve kritik metrikler</p>
            </header>

            {/* ÜST KARTLAR (Madde 2-A) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
                <div style={cardStyle(theme)}>
                    <span style={labelStyle}>TOPLAM ÜRÜN</span>
                    <div style={valueStyle(theme.primary)}>{products.length} Adet</div>
                </div>

                <div style={cardStyle(theme)}>
                    <span style={labelStyle}>TOPLAM STOK DEĞERİ</span>
                    <div style={valueStyle(theme.accent)}>{totalValue.toLocaleString()} TRY</div>
                </div>

                <div style={cardStyle(theme)}>
                    <span style={labelStyle}>GELECEK TAHMİNİ (AI)</span>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '10px', color: theme.primary }}>
                        {forecast ? `${forecast.productName} için önümüzdeki ay ${forecast.estimatedValue} adet talep bekleniyor.` : "Analiz bekleniyor..."}
                    </div>
                </div>
            </div>

            {/* KRİTİK UYARI TABLOSU (Madde 2-A) */}
            <div style={{ ...cardStyle(theme), border: '1px solid #FED7D7', backgroundColor: '#FFF5F5' }}>
                <h3 style={{ color: '#C53030', fontSize: '18px', marginBottom: '15px' }}>⚠️ DİKKAT! Stok Seviyesi Kritik Ürünler</h3>
                {criticalStocks.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', color: '#742A2A', fontSize: '12px', borderBottom: '2px solid #FEB2B2' }}>
                                <th style={{ padding: '10px' }}>ÜRÜN ADI</th>
                                <th>MEVCUT MİKTAR</th>
                                <th>DURUM</th>
                            </tr>
                        </thead>
                        <tbody>
                            {criticalStocks.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #FED7D7' }}>
                                    <td style={{ padding: '12px', fontWeight: '700' }}>{s.product.name}</td>
                                    <td style={{ fontWeight: '800', color: '#E53E3E' }}>{s.quantity}</td>
                                    <td><span style={badgeStyle}>ACİL SİPARİŞ</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p style={{ color: '#718096' }}>Şu an kritik seviyede ürün bulunmuyor.</p>
                )}
            </div>
        </div>
    );
};

// CSS-in-JS Stilleri
const cardStyle = (theme) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: theme.cardShadow,
    border: '1px solid rgba(226, 232, 240, 0.8)'
});

const labelStyle = { color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '1px' };
const valueStyle = (color) => ({ fontSize: '32px', fontWeight: '800', marginTop: '10px', color: color });
const badgeStyle = { backgroundColor: '#FEB2B2', color: '#742A2A', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' };

export default Dashboard;
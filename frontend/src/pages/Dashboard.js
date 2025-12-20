import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [forecast, setForecast] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0); // Hangi üründe olduğumuzu tutar

    const theme = {
        primary: '#2D3748', // Antrasit
        accent: '#F97316',  // Turuncu
        bg: '#F8FAFC',
        cardShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    };

    // 1. ADIM: Sayfa açılınca Ürünleri ve Stokları Çek
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const prodRes = await axios.get("http://localhost:8080/api/products");
                setProducts(prodRes.data);

                const stockRes = await axios.get("http://localhost:8080/api/stocks");
                setStocks(stockRes.data);
            } catch (err) {
                console.error("Veri hatası:", err);
            }
        };
        fetchInitialData();
    }, []);

    // 2. ADIM: Her 10 saniyede bir sıradaki ürüne geç
    useEffect(() => {
        if (products.length === 0) return; // Ürün yoksa çalışma

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length); // Başa döngü (Loop)
        }, 10000); // 10 Saniye

        return () => clearInterval(interval); // Sayfadan çıkınca sayacı durdur
    }, [products]);

    // 3. ADIM: Sıra değiştiğinde o ürünün tahminini çek
    useEffect(() => {
        if (products.length === 0) return;

        const currentProduct = products[currentIndex];
        
        // Yükleniyor efekti için önce boşaltalım (isteğe bağlı)
        // setForecast(null); 

        axios.get(`http://localhost:8080/api/forecast/${currentProduct.id}`)
            .then(res => setForecast(res.data))
            .catch(() => {
                // Eğer hata alırsak (tahmin yoksa) elle sahte veri basalım ki boş durmasın
                setForecast({ 
                    productName: currentProduct.name, 
                    dailyUsageRate: 0, // Tahmin yoksa 0
                    estimatedValue: 0 
                });
            });

    }, [currentIndex, products]);

    // Hesaplamalar
    const totalValue = stocks.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0);
    const criticalStocks = stocks.filter(s => s.quantity < s.minimumQuantity);

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary, margin: 0 }}>Operasyonel Özet</h1>
                <p style={{ color: '#64748B', marginTop: '5px' }}>Depo genel durumu ve kritik metrikler</p>
            </header>

            {/* KARTLAR */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginBottom: '40px' }}>
                
                {/* 1. KART: Toplam Ürün */}
                <div style={cardStyle(theme)}>
                    <span style={labelStyle}>TOPLAM ÜRÜN</span>
                    <div style={valueStyle(theme.primary)}>{products.length} Adet</div>
                </div>

                {/* 2. KART: Toplam Değer */}
                <div style={cardStyle(theme)}>
                    <span style={labelStyle}>TOPLAM STOK DEĞERİ</span>
                    <div style={valueStyle(theme.accent)}>{totalValue.toLocaleString()} TRY</div>
                </div>

                {/* 3. KART: CANLI AI TAHMİNİ (Slayt) */}
                <div style={cardStyle(theme)}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={labelStyle}>GELECEK AY TAHMİNİ</span>
                        {/* Sağ üstte minik sayaç/gösterge */}
                        <span style={{ fontSize: '10px', color: '#CBD5E0', fontWeight: 'bold' }}>
                            {currentIndex + 1} / {products.length}
                        </span>
                    </div>

                    <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '10px', color: theme.primary, minHeight: '60px' }}>
                        {forecast ? (
                            <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                                <span style={{ color: theme.accent, fontWeight: '800', fontSize: '20px' }}>
                                    {Math.ceil(forecast.dailyUsageRate * 30)}
                                </span> 
                                <span style={{ marginLeft: '5px' }}>adet talep bekleniyor.</span>
                                
                                <div style={{ 
                                    fontSize: '13px', 
                                    color: '#64748B', 
                                    marginTop: '8px', 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '6px' 
                                }}>
                                    <span style={{ width: '8px', height: '8px', backgroundColor: theme.accent, borderRadius: '50%', display: 'inline-block' }}></span>
                                    {forecast.productName}
                                </div>
                            </div>
                        ) : (
                            <span style={{ color: '#A0AEC0' }}>Veriler analiz ediliyor...</span>
                        )}
                    </div>
                </div>
            </div>

            {/* KRİTİK STOK TABLOSU */}
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
            
            {/* Animasyon stili */}
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

// Stiller
const cardStyle = (theme) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: theme.cardShadow,
    border: '1px solid rgba(226, 232, 240, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
});

const labelStyle = { color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '1px' };
const valueStyle = (color) => ({ fontSize: '32px', fontWeight: '800', marginTop: '10px', color: color });
const badgeStyle = { backgroundColor: '#FEB2B2', color: '#742A2A', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' };

export default Dashboard;
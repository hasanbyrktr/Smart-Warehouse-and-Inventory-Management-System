import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Grafik Kütüphanesi
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [forecast, setForecast] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const theme = {
        primary: '#2D3748',
        accent: '#F97316',
        bg: '#F8FAFC',
        cardShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    };

    // Grafik Renkleri
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const prodRes = await axios.get("http://localhost:8080/api/products");
                setProducts(prodRes.data);
                const stockRes = await axios.get("http://localhost:8080/api/stocks");
                setStocks(stockRes.data);
            } catch (err) { console.error("Veri hatası:", err); }
        };
        fetchInitialData();
    }, []);

    // Slayt Mantığı
    useEffect(() => {
        if (products.length === 0) return;
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
        }, 10000);
        return () => clearInterval(interval);
    }, [products]);

    // Tahmin Verisi
    useEffect(() => {
        if (products.length === 0) return;
        const currentProduct = products[currentIndex];
        
        axios.get(`http://localhost:8080/api/forecast/${currentProduct.id}`)
            .then(res => setForecast(res.data))
            .catch(() => {
                setForecast({ 
                    productName: currentProduct.name, 
                    dailyUsageRate: 0, 
                    estimatedValue: 0 
                });
            });
    }, [currentIndex, products]);

    const totalValue = stocks.reduce((acc, curr) => acc + (curr.quantity * curr.product.price), 0);
    
    // Kritik Stokları Filtrele
    const criticalStocks = stocks.filter(s => s.quantity < s.minimumQuantity);
    
    // --- YENİ MANTIK: HER ŞEY YOLUNDA MI? ---
    const isAllSafe = criticalStocks.length === 0;

    // Grafik Verisi Hazırlama
    const chartData = stocks
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map(s => ({ name: s.product.name, value: s.quantity }));

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary, margin: 0 }}>Operasyonel Özet</h1>
                <p style={{ color: '#64748B', marginTop: '5px' }}>Depo genel durumu ve kritik metrikler</p>
            </header>

            {/* ÜST KARTLAR */}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={labelStyle}>GELECEK AY TAHMİNİ</span>
                        <span style={{ fontSize: '10px', color: '#CBD5E0', fontWeight: 'bold' }}>{currentIndex + 1} / {products.length}</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: '600', marginTop: '10px', color: theme.primary, minHeight: '60px' }}>
                        {forecast ? (
                            <div style={{ animation: 'fadeIn 0.5s ease-in-out' }}>
                                <span style={{ color: theme.accent, fontWeight: '800', fontSize: '20px' }}>
                                    {Math.ceil(forecast.dailyUsageRate * 30)}
                                </span> 
                                <span style={{ marginLeft: '5px' }}>adet talep bekleniyor.</span>
                                <div style={{ fontSize: '13px', color: '#64748B', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: '8px', height: '8px', backgroundColor: theme.accent, borderRadius: '50%', display: 'inline-block' }}></span>
                                    {forecast.productName}
                                </div>
                            </div>
                        ) : <span style={{ color: '#A0AEC0' }}>Veriler analiz ediliyor...</span>}
                    </div>
                </div>
            </div>

            {/* --- GRAFİK ve DURUM TABLOSU --- */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                
                {/* SOL: PASTA GRAFİĞİ */}
                <div style={cardStyle(theme)}>
                    <h3 style={{ color: theme.primary, fontSize: '18px', marginBottom: '20px' }}>📊 Stok Dağılımı (Top 5)</h3>
                    <div style={{ width: '100%', height: '300px' }}>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p style={{ color: '#A0AEC0', textAlign: 'center', marginTop: '100px' }}>Veri bulunamadı.</p>
                        )}
                    </div>
                </div>

                {/* SAĞ: KRİTİK UYARI KUTUSU (AKILLI RENKLENDİRME) */}
                <div style={{ 
                    ...cardStyle(theme), 
                    // Eğer hepsi güvenliyse YEŞİL, değilse KIRMIZI tema
                    border: isAllSafe ? '1px solid #C6F6D5' : '1px solid #FED7D7', 
                    backgroundColor: isAllSafe ? '#F0FFF4' : '#FFF5F5' 
                }}>
                    <h3 style={{ 
                        color: isAllSafe ? '#2F855A' : '#C53030', // Yeşil Yazı vs Kırmızı Yazı
                        fontSize: '18px', 
                        marginBottom: '15px' 
                    }}>
                        {isAllSafe ? '✅ Stok Durumu İdeal' : '⚠️ Kritik Stok Seviyesi'}
                    </h3>
                    
                    {!isAllSafe ? (
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', color: '#742A2A', fontSize: '12px', borderBottom: '2px solid #FEB2B2' }}>
                                        <th style={{ padding: '10px' }}>ÜRÜN ADI</th>
                                        <th>ADET</th>
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
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '200px', color: '#48BB78' }}>
                            <span style={{ fontSize: '50px' }}>✓</span>
                            <p style={{ fontWeight: '600', marginTop: '10px' }}>Tüm ürünler yeterli seviyede.</p>
                            <p style={{ fontSize: '13px', opacity: 0.8 }}>Kritik eşiğin altında ürün yok.</p>
                        </div>
                    )}
                </div>
            </div>
            
            <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
};

const cardStyle = (theme) => ({
    backgroundColor: '#FFFFFF',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: theme.cardShadow,
    border: '1px solid rgba(226, 232, 240, 0.8)',
    display: 'flex',
    flexDirection: 'column',
});

const labelStyle = { color: '#64748B', fontSize: '12px', fontWeight: '800', letterSpacing: '1px' };
const valueStyle = (color) => ({ fontSize: '32px', fontWeight: '800', marginTop: '10px', color: color });
const badgeStyle = { backgroundColor: '#FEB2B2', color: '#742A2A', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' };

export default Dashboard;
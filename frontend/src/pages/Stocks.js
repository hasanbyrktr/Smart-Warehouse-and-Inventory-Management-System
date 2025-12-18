import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Stocks = () => {
    const [stocks, setStocks] = useState([]);
    const theme = { primary: '#2D3748', accent: '#F97316', bg: '#F8FAFC' };

    useEffect(() => {
        // Backend'deki StockController'dan verileri çekiyoruz
        axios.get("http://localhost:8080/api/stocks")
            .then(res => setStocks(res.data))
            .catch(err => console.error("Stoklar yüklenemedi:", err));
    }, []);

    // Stok seviyesine göre görsel geri bildirim mantığı
    const getLevelInfo = (qty, min) => {
        if (qty <= 0) return { label: 'TÜKENDİ', color: '#EF4444', percent: 0 };
        if (qty < min) return { label: 'KRİTİK', color: '#F59E0B', percent: (qty / 100) * 100 };
        return { label: 'YETERLİ', color: '#10B981', percent: 100 };
    };

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <header style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between' }}>
                <div>
                    <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary, margin: 0 }}>Stok Kontrol Merkezi</h1>
                    <p style={{ color: '#64748B' }}>Anlık envanter miktarları ve kritik seviye takibi</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
                {stocks.map(item => {
                    const status = getLevelInfo(item.quantity, item.minimumQuantity);
                    return (
                        <div key={item.id} style={stockCardStyle}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <span style={{ fontWeight: '800', color: theme.primary }}>{item.product.name}</span>
                                <span style={{ ...badgeStyle, backgroundColor: status.color }}>{status.label}</span>
                            </div>

                            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '5px' }}>
                                Mevcut Miktar: <strong>{item.quantity}</strong> / Eşik: {item.minimumQuantity}
                            </div>

                            {/* Görsel Stok Çubuğu */}
                            <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${Math.min(status.percent, 100)}%`,
                                    height: '100%',
                                    backgroundColor: status.color,
                                    transition: 'width 0.5s ease-in-out'
                                }}></div>
                            </div>

                            <div style={{ marginTop: '15px', fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>
                                Son Güncelleme: {new Date(item.lastUpdated).toLocaleDateString()}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// CSS Stilleri
const stockCardStyle = {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
    border: '1px solid #E2E8F0'
};

const badgeStyle = {
    color: 'white',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '10px',
    fontWeight: '800'
};

export default Stocks;
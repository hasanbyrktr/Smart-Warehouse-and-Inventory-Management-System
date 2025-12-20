import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Stocks = () => {
    const [stocks, setStocks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Başlangıç sıralaması: 'status' (Kritikler en üstte)
    const [sortConfig, setSortConfig] = useState({ key: 'status', direction: 'asc' });

    const theme = { primary: '#2D3748', accent: '#F97316', bg: '#F8FAFC' };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/stocks");
            setStocks(res.data);
        } catch (err) {
            console.error("Hata:", err);
            toast.error("Stok verileri alınırken hata oluştu.");
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // --- VERİ İŞLEME VE SIRALAMA ---
    const processedStocks = [...stocks]
        .filter(s => 
            s.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            s.product?.sku.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortConfig.key) return 0;

            let aValue, bValue;

            // 1. Duruma Göre (Kritik mi?)
            if (sortConfig.key === 'status') {
                aValue = (a.quantity < a.minimumQuantity) ? 0 : 1;
                bValue = (b.quantity < b.minimumQuantity) ? 0 : 1;
            }
            // 2. Ürün Adına Göre (Alfabetik)
            else if (sortConfig.key === 'name') {
                aValue = a.product?.name.toLowerCase();
                bValue = b.product?.name.toLowerCase();
            } 
            // 3. Mevcut Stok (DİREKT ADETE GÖRE)
            else if (sortConfig.key === 'quantity') {
                // --- DEĞİŞİKLİK BURADA: Oran yerine direkt sayıyı alıyoruz ---
                aValue = a.quantity; 
                bValue = b.quantity;
            } 

            // Karşılaştırma
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

    const getSortIndicator = (key) => {
        if (sortConfig.key !== key) return <span style={{opacity: 0.3}}> ↕</span>;
        return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    };

    const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
    const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' };
    const tableHeaderStyle = { textAlign: 'left', borderBottom: '2px solid #E2E8F0', fontSize: '12px', color: '#64748B', cursor: 'pointer', userSelect: 'none' };

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary, marginBottom: '10px' }}>Stok Durumu</h1>
            <p style={{ color: '#64748B', marginBottom: '40px' }}>Depodaki anlık miktarlar ve kritik seviye takibi</p>

            <div style={cardStyle}>
                
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: theme.primary }}>Envanter Listesi</h3>
                    <input 
                        type="text" 
                        placeholder="🔍 Ürün veya SKU ara..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ ...inputStyle, width: '300px', border: '1px solid #CBD5E0' }}
                    />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={tableHeaderStyle}>
                            
                            {/* 1. SÜTUN: DURUM (En Başta) */}
                            <th style={{ padding: '15px' }} onClick={() => handleSort('status')}>
                                DURUM & SAĞLIK {getSortIndicator('status')}
                            </th>

                            {/* 2. SÜTUN: ÜRÜN ADI */}
                            <th onClick={() => handleSort('name')}>
                                ÜRÜN ADI {getSortIndicator('name')}
                            </th>
                            
                            {/* 3. SÜTUN: SKU */}
                            <th>SKU</th>
                            
                            {/* 4. SÜTUN: MEVCUT STOK (Sayısal) */}
                            <th onClick={() => handleSort('quantity')}>
                                MEVCUT STOK {getSortIndicator('quantity')}
                            </th>
                            
                            {/* 5. SÜTUN: KRİTİK EŞİK */}
                            <th>KRİTİK EŞİK</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {processedStocks.length > 0 ? (
                            processedStocks.map(s => {
                                const isCritical = s.quantity < s.minimumQuantity;
                                const rowBg = isCritical ? '#FFF5F5' : 'transparent';
                                
                                return (
                                    <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9', backgroundColor: rowBg }}>
                                        
                                        {/* 1. SÜTUN: DURUM + BAR (En Sol) */}
                                        <td style={{ padding: '15px', width: '280px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                {/* Rozet */}
                                                <div style={{ minWidth: '80px' }}>
                                                    {isCritical ? (
                                                        <span style={{ backgroundColor: '#FED7D7', color: '#C53030', padding: '5px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                                                            ! KRİTİK
                                                        </span>
                                                    ) : (
                                                        <span style={{ backgroundColor: '#C6F6D5', color: '#2F855A', padding: '5px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>
                                                            ✓ YETERLİ
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Grafik Bar */}
                                                <div style={{ flex: 1, height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', minWidth: '100px' }}>
                                                    <div style={{ 
                                                        width: `${Math.min((s.quantity / (s.minimumQuantity * 3)) * 100, 100)}%`, 
                                                        height: '100%', 
                                                        backgroundColor: isCritical ? '#E53E3E' : '#48BB78',
                                                        transition: 'width 0.5s ease',
                                                        borderRadius: '4px'
                                                    }}></div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* 2. SÜTUN: ÜRÜN ADI */}
                                        <td style={{ fontWeight: '600' }}>{s.product?.name}</td>

                                        {/* 3. SÜTUN: SKU */}
                                        <td style={{ fontFamily: 'monospace', color: '#64748B' }}>{s.product?.sku}</td>
                                        
                                        {/* 4. SÜTUN: STOK SAYISI */}
                                        <td style={{ fontWeight: 'bold', fontSize: '15px' }}>{s.quantity}</td>

                                        {/* 5. SÜTUN: EŞİK */}
                                        <td style={{ color: '#718096' }}>{s.minimumQuantity}</td>
                                        
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#A0AEC0' }}>Kayıt bulunamadı.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Stocks;
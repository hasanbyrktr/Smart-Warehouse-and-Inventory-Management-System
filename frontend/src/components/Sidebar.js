import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();

    const theme = {
        primary: '#2D3748', // Antrasit
        accent: '#F97316',  // Turuncu
        bg: '#F8FAFC'
    };

    const menuItems = [
        { name: 'Dashboard', path: '/' },
        { name: 'Ürün Yönetimi', path: '/Products' },
        { name: 'Stok Durumu', path: '/Stocks' },
        { name: 'Sipariş & Sevkiyat', path: '/Orders' },
        { name: 'Tedarikçiler', path: '/Suppliers' },
    ];

    return (
        <div style={{
            width: '220px', // DEĞİŞİKLİK: 280px'den 220px'e düşürüldü
            backgroundColor: theme.primary,
            color: 'white',
            minHeight: '100vh',
            padding: '30px 16px', // DEĞİŞİKLİK: Padding azaltıldı (daha kompakt)
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '4px 0 15px rgba(0,0,0,0.1)',
            flexShrink: 0 // ÖNEMLİ: Sayfa küçüldüğünde sidebar'ın ezilmesini engeller
        }}>
            {/* Logo Alanı */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', paddingLeft: '5px' }}>
                <div style={{ width: '6px', height: '28px', backgroundColor: theme.accent, borderRadius: '4px' }}></div>
                {/* Font boyutu biraz küçültüldü ki sığsın */}
                <h2 style={{ fontSize: '18px', fontWeight: '800', letterSpacing: '0.5px', margin: 0 }}>CORE WAREHOUSE</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                padding: '12px 16px', // Buton iç boşlukları ayarlandı
                                borderRadius: '12px',
                                backgroundColor: isActive ? theme.accent : 'transparent',
                                fontWeight: '600',
                                fontSize: '13px', // Yazı boyutu hafif küçültüldü
                                transition: 'all 0.3s ease',
                                boxShadow: isActive ? '0 8px 20px rgba(249, 115, 22, 0.2)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}
                        >
                            <span>{item.icon}</span> {item.name}
                        </Link>
                    );
                })}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0.6, fontSize: '11px', textAlign: 'center' }}>
                Sistem Durumu: <span style={{ color: theme.accent }}>Aktif</span>
            </div>
        </div>
    );
};

export default Sidebar;
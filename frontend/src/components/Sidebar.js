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
            width: '280px',
            backgroundColor: theme.primary,
            color: 'white',
            minHeight: '100vh',
            padding: '40px 24px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '4px 0 15px rgba(0,0,0,0.1)' // Senin istediğin o derinlik
        }}>
            {/* Logo Alanı - Yumuşak Turuncu Vurgulu */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '50px' }}>
                <div style={{ width: '8px', height: '32px', backgroundColor: theme.accent, borderRadius: '4px' }}></div>
                <h2 style={{ fontSize: '20px', fontWeight: '800', letterSpacing: '1px', margin: 0 }}>CORE WAREHOUSE</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                padding: '14px 20px',
                                borderRadius: '14px', // Senin istediğin o yuvarlak hatlar
                                backgroundColor: isActive ? theme.accent : 'transparent',
                                fontWeight: '600',
                                fontSize: '14px',
                                transition: 'all 0.3s ease',
                                boxShadow: isActive ? '0 8px 20px rgba(249, 115, 22, 0.2)' : 'none', // Parlaklık hissi
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px'
                            }}
                        >
                            <span>{item.icon}</span> {item.name}
                        </Link>
                    );
                })}
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)', opacity: 0.6, fontSize: '12px' }}>
                Sistem Durumu: <span style={{ color: theme.accent }}>Aktif</span>
            </div>
        </div>
    );
};

export default Sidebar;
import React from 'react';

function Navbar({ setActivePage }) {
    return (
        <nav style={{ padding: '10px', backgroundColor: '#2c3e50', color: 'white', display: 'flex', gap: '20px' }}>
            <span onClick={() => setActivePage('dashboard')} style={{ cursor: 'pointer' }}>🏠 Dashboard</span>
            <span onClick={() => setActivePage('orders')} style={{ cursor: 'pointer' }}>🛒 Sipariş Listesi</span>
            <span onClick={() => setActivePage('suppliers')} style={{ cursor: 'pointer' }}>🏢 Tedarikçiler</span>
        </nav>
    );
}
export default Navbar;
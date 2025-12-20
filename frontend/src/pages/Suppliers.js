import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', email: '' });

    const theme = {
        primary: '#2D3748',
        accent: '#F97316',
        bg: '#F8FAFC',
        danger: '#E53E3E'
    };

    useEffect(() => { fetchSuppliers(); }, []);

    const fetchSuppliers = () => {
        axios.get("http://localhost:8080/api/suppliers")
            .then(res => setSuppliers(res.data))
            .catch(err => console.error(err));
    };

    const handleAdd = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/api/suppliers", newSupplier).then(() => {
            setNewSupplier({ name: '', contact: '', email: '' });
            fetchSuppliers();
        });
    };

    const deleteSupplier = async (id) => {
        if (window.confirm("Bu tedarikçiyi silmek istediğinize emin misiniz?")) {
            try {
                await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
                fetchSuppliers();
            } catch (err) {
                alert("Silme başarısız! Tedarikçiye bağlı ürünler olabilir.");
            }
        }
    };

    // MODERN BUTON STİLİ
    const deleteButtonStyle = {
        padding: '8px 16px',
        backgroundColor: '#FFF5F5',
        color: theme.danger,
        border: '1px solid #FED7D7',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: '700',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px'
    };

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <h1 style={{ fontWeight: '800', color: theme.primary, marginBottom: '30px' }}>Tedarikçi Yönetimi</h1>

            {/* EKLEME FORMU */}
            <div style={cardStyle}>
                <h4 style={{ color: theme.accent, marginBottom: '20px' }}>Yeni Tedarikçi Kaydı</h4>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '15px' }}>
                    <input style={inputStyle} placeholder="Firma Adı" value={newSupplier.name} onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })} required />
                    <input style={inputStyle} placeholder="İletişim" value={newSupplier.phone} onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })} />
                    <input style={inputStyle} placeholder="E-posta" value={newSupplier.email} onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })} />
                    <button type="submit" style={addButtonStyle(theme)}>+ EKLE</button>
                </form>
            </div>

            {/* TABLO */}
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={tableHeaderStyle}>
                            <th style={{ padding: '15px' }}>TEDARİKÇİ ADI</th>
                            <th>İLETİŞİM</th>
                            <th>E-POSTA</th>
                            <th style={{ textAlign: 'right', paddingRight: '20px' }}>İŞLEM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '18px 15px', fontWeight: '600' }}>{s.name}</td>
                                <td>{s.phone}</td>
                                <td>{s.email}</td>
                                <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                    <button
                                        onClick={() => deleteSupplier(s.id)}
                                        style={deleteButtonStyle}
                                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FEB2B2'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFF5F5'; }}
                                    >
                                        <span>🗑️</span> Sil
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// YARDIMCI STİLLER
const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const inputStyle = { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' };
const tableHeaderStyle = { textAlign: 'left', borderBottom: '2px solid #E2E8F0', fontSize: '12px', color: '#64748B' };
const addButtonStyle = (theme) => ({ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' });

export default Suppliers;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [newSupplier, setNewSupplier] = useState({ name: '', contact: '', email: '' });
    const theme = { primary: '#2D3748', accent: '#F97316', bg: '#F8FAFC' };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = () => {
        axios.get("http://localhost:8080/api/suppliers").then(res => setSuppliers(res.data));
    };

    const handleAdd = (e) => {
        e.preventDefault();
        axios.post("http://localhost:8080/api/suppliers", newSupplier).then(() => {
            setNewSupplier({ name: '', contact: '', email: '' });
            fetchSuppliers();
        });
    };

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <h1 style={{ fontWeight: '800', color: theme.primary, marginBottom: '30px' }}>Tedarikçi Yönetimi</h1>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <h4 style={{ color: theme.accent, marginBottom: '20px' }}>Yeni Tedarikçi Kaydı</h4>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '15px' }}>
                    <input style={inputStyle} placeholder="Firma Adı" value={newSupplier.name} onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })} required />
                    <input style={inputStyle} placeholder="İletişim" value={newSupplier.contact} onChange={e => setNewSupplier({ ...newSupplier, contact: e.target.value })} />
                    <input style={inputStyle} placeholder="E-posta" value={newSupplier.email} onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })} />
                    <button type="submit" style={{ backgroundColor: theme.primary, color: 'white', border: 'none', padding: '10px 25px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>EKLE</button>
                </form>
            </div>

            <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', borderBottom: '2px solid #E2E8F0', fontSize: '12px', color: '#64748B' }}>
                            <th style={{ padding: '15px' }}>TEDARİKÇİ ADI</th>
                            <th>İLETİŞİM</th>
                            <th>E-POSTA</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '15px', fontWeight: '600' }}>{s.name}</td>
                                <td>{s.contact}</td>
                                <td>{s.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const inputStyle = { flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' };

export default Suppliers;
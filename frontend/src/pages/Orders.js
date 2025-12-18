import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [newOrder, setNewOrder] = useState({ productId: '', quantity: '', orderType: 'IN' });

    const theme = { primary: '#2D3748', accent: '#F97316', bg: '#F8FAFC' };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const prodRes = await axios.get("http://localhost:8080/api/products");
        const orderRes = await axios.get("http://localhost:8080/api/orders");
        setProducts(prodRes.data);
        setOrders(orderRes.data);
    };

    const handleOrder = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/orders", {
                product: { id: parseInt(newOrder.productId) }, // Java Long beklediği için ID nesne içinde gitmeli
                quantity: parseInt(newOrder.quantity),
                orderType: newOrder.orderType, // Java'daki OrderType Enum (IN/OUT)
                status: "COMPLETED" // Backend varsayılanı ile uyumlu
            });
            alert("Stok işlemi başarıyla kaydedildi!");
            fetchData();
        } catch (err) {
            alert("Hata: " + (err.response?.data?.message || "İşlem yapılamadı"));
        }
    };

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <h1 style={{ color: theme.primary, fontWeight: '800' }}>Sipariş & Sevkiyat</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                {/* SOL: SİPARİŞ FORMU */}
                <div style={cardStyle}>
                    <h3 style={{ color: theme.accent }}>Yeni İşlem Kaydı</h3>
                    <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <select style={inputStyle} onChange={e => setNewOrder({ ...newOrder, productId: e.target.value })} required>
                            <option value="">Ürün Seçin</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <select style={inputStyle} onChange={e => setNewOrder({ ...newOrder, orderType: e.target.value })}>
                            <option value="IN">Giriş (IN) - Stok Artır</option>
                            <option value="OUT">Çıkış (OUT) - Stok Azalt</option>
                        </select>
                        <input style={inputStyle} type="number" placeholder="Adet" onChange={e => setNewOrder({ ...newOrder, quantity: e.target.value })} required />
                        <button type="submit" style={buttonStyle(theme)}>İŞLEMİ ONAYLA</button>
                    </form>
                </div>

                {/* SAĞ: GEÇMİŞ İŞLEMLER */}
                <div style={cardStyle}>
                    <h3 style={{ color: theme.primary }}>Son Hareketler</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                        <thead>
                            <tr style={{ textAlign: 'left', borderBottom: '2px solid #E2E8F0' }}>
                                <th style={{ padding: '10px' }}>ÜRÜN</th>
                                <th>TİP</th>
                                <th>ADET</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(o => (
                                <tr key={o.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '10px' }}>{o.product.name}</td>
                                    <td style={{ color: o.orderType === 'IN' ? 'green' : 'red', fontWeight: 'bold' }}>{o.orderType}</td>
                                    <td>{o.quantity}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' };
const buttonStyle = (theme) => ({ backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '10px', padding: '15px', fontWeight: '800', cursor: 'pointer' });

export default Orders;
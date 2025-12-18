import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '', sku: '', supplierId: '' });

    const theme = {
        primary: '#2D3748',
        accent: '#F97316',
        bg: '#F8FAFC',
        cardShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const prodRes = await axios.get("http://localhost:8080/api/products");
            const suppRes = await axios.get("http://localhost:8080/api/suppliers");
            setProducts(prodRes.data);
            setSuppliers(suppRes.data);
        } catch (err) {
            console.error("Veri yükleme hatası:", err);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/products", {
                name: newProduct.name,
                sku: newProduct.sku, // Backend'de @Column(unique = true)
                price: parseFloat(newProduct.price), // Java BigDecimal'e dönüşecek
                description: newProduct.description || "",
                supplier: { id: parseInt(newProduct.supplierId) } // Supplier nesnesi
            });
            setNewProduct({ name: '', price: '', sku: '', supplierId: '', description: '' });
            fetchData();
        } catch (err) {
            alert("Ürün eklenemedi: " + (err.response?.data?.message || "Hata"));
        }
    };
    const deleteProduct = async (id) => {
        if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            await axios.delete(`http://localhost:8080/api/products/${id}`);
            fetchData();
        }
    };

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary }}>Ürün Yönetimi</h1>
                <p style={{ color: '#64748B' }}>Sisteme kayıtlı tüm ürünlerin listesi ve yönetimi</p>
            </header>

            {/* YENİ ÜRÜN EKLEME FORMU (Madde 2-B) */}
            <div style={{ ...cardStyle, marginBottom: '40px' }}>
                <h3 style={{ marginBottom: '20px', color: theme.primary }}>Yeni Ürün Ekle</h3>
                <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px' }}>
                    <input style={inputStyle} placeholder="Ürün Adı" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                    <input style={inputStyle} type="number" placeholder="Fiyat" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                    <input style={inputStyle} placeholder="SKU (Kod)" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} required />
                    <select style={inputStyle} value={newProduct.supplierId} onChange={e => setNewProduct({ ...newProduct, supplierId: e.target.value })} required>
                        <option value="">Tedarikçi Seçin</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <button type="submit" style={buttonStyle(theme)}>KAYDET</button>
                </form>
            </div>

            {/* ÜRÜN LİSTESİ TABLOSU (Madde 2-B) */}
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left', color: '#64748B', fontSize: '12px', borderBottom: '2px solid #E2E8F0' }}>
                            <th style={{ padding: '15px' }}>ÜRÜN ADI</th>
                            <th>FİYAT</th>
                            <th>SKU</th>
                            <th>TEDARİKÇİ</th>
                            <th style={{ textAlign: 'right' }}>AKSİYON</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                <td style={{ padding: '15px', fontWeight: '600' }}>{p.name}</td>
                                <td>{p.price} TRY</td>
                                <td style={{ fontFamily: 'monospace' }}>{p.sku}</td>
                                <td>{p.supplier?.name}</td>
                                <td style={{ textAlign: 'right' }}>
                                    <button onClick={() => deleteProduct(p.id)} style={deleteButtonStyle}>SİL</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// TASARIM STİLLERİ
const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(226, 232, 240, 0.8)' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' };
const buttonStyle = (theme) => ({ backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '10px', padding: '12px', fontWeight: '800', cursor: 'pointer' });
const deleteButtonStyle = { color: '#E53E3E', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer' };

export default Products;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    
    // Yeni ürün verileri (Kritik Stok Eşiği dahil)
    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        price: '', 
        sku: '', 
        supplierId: '', 
        initialStockLimit: '' 
    });

    const theme = {
        primary: '#2D3748',
        accent: '#F97316',
        bg: '#F8FAFC',
        danger: '#E53E3E'
    };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const prodRes = await axios.get("http://localhost:8080/api/products");
            const suppRes = await axios.get("http://localhost:8080/api/suppliers");
            setProducts(prodRes.data);
            setSuppliers(suppRes.data);
        } catch (err) { console.error("Veri çekme hatası:", err); }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/products", {
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                sku: newProduct.sku,
                supplier: { id: parseInt(newProduct.supplierId) },
                // Backend'e stok limitini gönderiyoruz
                initialStockLimit: newProduct.initialStockLimit ? parseInt(newProduct.initialStockLimit) : null
            });
            
            setNewProduct({ name: '', price: '', sku: '', supplierId: '', initialStockLimit: '' });
            fetchData();
        } catch (err) { alert("Ürün eklenemedi! SKU benzersiz olmalı."); }
    };

    const deleteProduct = async (id) => {
        if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${id}`);
                fetchData();
                alert("Ürün başarıyla sistemden kaldırıldı. ✅");
            } catch (err) { 
                // GÜNCELLENEN HATA MESAJI
                alert("⛔ İŞLEM ENGELLENDİ!\n\nBu ürüne ait geçmiş Sipariş veya Stok kayıtları bulunmaktadır.\n\nVeri güvenliği nedeniyle, geçmiş hareketi olan ürünler silinemez. Sadece satışı durdurulabilir."); 
            }
        }
    };

    // MODERN SİLME BUTONU STİLİ
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
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary }}>Ürün Yönetimi</h1>
                <p style={{ color: '#64748B' }}>Sisteme kayıtlı ürünlerin listesi ve düzenleme alanı</p>

                {/* --- YENİ BİLGİLENDİRME KUTUSU (SARI KUTU) --- */}
                <div style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    backgroundColor: '#FFFBEB', // Açık Sarı Zemin
                    border: '1px solid #FCD34D', // Sarı Çerçeve
                    borderRadius: '10px', 
                    color: '#92400E', // Koyu Turuncu Yazı
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    maxWidth: '800px' // Çok geniş ekranda aşırı uzamasın diye
                }}>
                    <span style={{ fontSize: '20px' }}>ℹ️</span>
                    <div>
                        <strong>Bilgilendirme:</strong> Veri bütünlüğü ilkesi gereği, geçmişte <u>sipariş veya stok hareketi</u> bulunan ürünler sistemden tamamen silinemez.
                    </div>
                </div>
                {/* ------------------------------------------- */}
            </header>

            {/* EKLEME FORMU */}
            <div style={cardStyle}>
                <h4 style={{ color: theme.accent, marginBottom: '20px' }}>Yeni Ürün Ekle</h4>
                <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    
                    <input style={inputStyle} placeholder="Ürün Adı" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                    <input style={inputStyle} type="number" placeholder="Fiyat" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                    <input style={inputStyle} placeholder="SKU (Kod)" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} required />
                    
                    {/* Kritik Stok Eşiği Inputu */}
                    <input 
                        style={inputStyle} 
                        type="number" 
                        placeholder="Kritik Stok Eşiği (Örn: 10)" 
                        value={newProduct.initialStockLimit} 
                        onChange={e => setNewProduct({ ...newProduct, initialStockLimit: e.target.value })} 
                    />

                    <select style={inputStyle} value={newProduct.supplierId} onChange={e => setNewProduct({ ...newProduct, supplierId: e.target.value })} required>
                        <option value="">Tedarikçi Seçin</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>

                    <button type="submit" style={addButtonStyle(theme)}>KAYDET</button>
                </form>
            </div>

            {/* TABLO */}
            <div style={cardStyle}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={tableHeaderStyle}>
                            <th style={{ padding: '15px' }}>ÜRÜN ADI</th>
                            <th>FİYAT</th>
                            <th>SKU</th>
                            <th>TEDARİKÇİ</th>
                            <th style={{ textAlign: 'right', paddingRight: '20px' }}>İŞLEM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                <td style={{ padding: '18px 15px', fontWeight: '600' }}>{p.name}</td>
                                <td>{p.price} TRY</td>
                                <td style={{ fontFamily: 'monospace', color: '#64748B' }}>{p.sku}</td>
                                <td>{p.supplier?.name || '---'}</td>
                                <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                    <button
                                        onClick={() => deleteProduct(p.id)}
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

const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' };
const tableHeaderStyle = { textAlign: 'left', borderBottom: '2px solid #E2E8F0', fontSize: '12px', color: '#64748B' };
const addButtonStyle = (theme) => ({ backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' });

export default Products;
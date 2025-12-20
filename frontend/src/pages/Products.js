import React, { useState, useEffect } from 'react';
import axios from 'axios';
// YENİ: Toast import edildi
import { toast } from 'react-toastify';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); 

    const [newProduct, setNewProduct] = useState({ 
        name: '', price: '', sku: '', description: '', supplierId: '', initialStockLimit: '' 
    });

    const theme = { primary: '#2D3748', accent: '#F97316', bg: '#F8FAFC', danger: '#E53E3E' };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const prodRes = await axios.get("http://localhost:8080/api/products");
            const suppRes = await axios.get("http://localhost:8080/api/suppliers");
            setProducts(prodRes.data);
            setSuppliers(suppRes.data);
        } catch (err) { 
            console.error("Veri çekme hatası:", err);
            // toast.error("Veriler yüklenirken hata oluştu!"); 
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/products", {
                name: newProduct.name,
                price: parseFloat(newProduct.price),
                sku: newProduct.sku,
                description: newProduct.description,
                supplier: { id: parseInt(newProduct.supplierId) },
                initialStockLimit: newProduct.initialStockLimit ? parseInt(newProduct.initialStockLimit) : null
            });
            setNewProduct({ name: '', price: '', sku: '', description: '', supplierId: '', initialStockLimit: '' });
            fetchData();
            
            // YENİ: Başarılı bildirimi (Yeşil)
            toast.success("✅ Ürün başarıyla eklendi!"); 

        } catch (err) { 
            // YENİ: Hata bildirimi (Kırmızı)
            toast.error("❌ Ürün eklenemedi! SKU kodu benzersiz olmalı."); 
        }
    };

    const deleteProduct = async (id) => {
        // Silme işlemi kritik olduğu için window.confirm kalabilir veya özel kütüphane kullanılabilir.
        // Şimdilik standart onay kutusu kalsın.
        if (window.confirm("Bu ürünü silmek istediğinize emin misiniz?")) {
            try {
                await axios.delete(`http://localhost:8080/api/products/${id}`);
                fetchData();
                
                // YENİ: Silme başarılı
                toast.info("🗑️ Ürün sistemden kaldırıldı.");

            } catch (err) { 
                // YENİ: Silme engellendi uyarısı
                toast.warning("⛔ SİLİNEMEZ! Bu ürüne ait geçmiş sipariş kayıtları var."); 
            }
        }
    };

    // Arama Filtresi
    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase();
        return (
            product.name.toLowerCase().includes(term) || 
            product.sku.toLowerCase().includes(term) || 
            (product.supplier && product.supplier.name.toLowerCase().includes(term))
        );
    });

    const deleteButtonStyle = { padding: '8px 16px', backgroundColor: '#FFF5F5', color: theme.danger, border: '1px solid #FED7D7', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s ease', display: 'inline-flex', alignItems: 'center', gap: '8px' };
    const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
    const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' };
    const tableHeaderStyle = { textAlign: 'left', borderBottom: '2px solid #E2E8F0', fontSize: '12px', color: '#64748B' };
    const addButtonStyle = (theme) => ({ backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', padding: '15px' });

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <header style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary }}>Ürün Yönetimi</h1>
                <p style={{ color: '#64748B' }}>Sisteme kayıtlı ürünlerin listesi ve düzenleme alanı</p>

                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: '10px', color: '#92400E', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '800px'}}>
                    <span style={{ fontSize: '20px' }}>ℹ️</span>
                    <div><strong>Bilgilendirme:</strong> Veri bütünlüğü ilkesi gereği, geçmişte <u>sipariş veya stok hareketi</u> gören ürünler sistemden tamamen silinemez.</div>
                </div>
            </header>

            {/* EKLEME FORMU */}
            <div style={cardStyle}>
                <h4 style={{ color: theme.accent, marginBottom: '20px' }}>Yeni Ürün Ekle</h4>
                <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
                    <input style={inputStyle} placeholder="Ürün Adı" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
                    <input style={inputStyle} type="number" placeholder="Fiyat" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} required />
                    <input style={inputStyle} placeholder="SKU (Kod)" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} required />
                    <input style={inputStyle} type="number" placeholder="Kritik Stok Eşiği (Örn: 10)" value={newProduct.initialStockLimit} onChange={e => setNewProduct({ ...newProduct, initialStockLimit: e.target.value })} />
                    <select style={inputStyle} value={newProduct.supplierId} onChange={e => setNewProduct({ ...newProduct, supplierId: e.target.value })} required>
                        <option value="">Tedarikçi Seçin</option>
                        {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                    <input style={inputStyle} placeholder="Ürün Açıklaması (Opsiyonel)" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} />
                    <button type="submit" style={{ ...addButtonStyle(theme), gridColumn: '1 / -1' }}>KAYDET</button>
                </form>
            </div>

            {/* TABLO ve ARAMA ÇUBUĞU */}
            <div style={cardStyle}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: theme.primary }}>Ürün Listesi</h3>
                    <input type="text" placeholder="🔍 Ürün adı, SKU veya Tedarikçi ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, width: '300px', border: '1px solid #CBD5E0' }} />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={tableHeaderStyle}>
                            <th style={{ padding: '15px' }}>ÜRÜN ADI</th>
                            <th>AÇIKLAMA</th>
                            <th>FİYAT</th>
                            <th>SKU</th>
                            <th>TEDARİKÇİ</th>
                            <th style={{ textAlign: 'right', paddingRight: '20px' }}>İŞLEM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map(p => (
                                <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '18px 15px', fontWeight: '600' }}>{p.name}</td>
                                    <td style={{ color: '#64748B', fontSize: '13px', maxWidth: '200px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{p.description || '-'}</td>
                                    <td>{p.price} TRY</td>
                                    <td style={{ fontFamily: 'monospace', color: '#64748B' }}>{p.sku}</td>
                                    <td>{p.supplier?.name || '---'}</td>
                                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                        <button onClick={() => deleteProduct(p.id)} style={deleteButtonStyle} onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FEB2B2'; }} onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#FFF5F5'; }}>
                                            <span>⭙</span> Sil
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" style={{ padding: '20px', textAlign: 'center', color: '#A0AEC0' }}>Aradığınız kriterde ürün bulunamadı.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
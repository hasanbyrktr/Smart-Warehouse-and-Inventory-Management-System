import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// YENİ: Excel kütüphanesi
import * as XLSX from 'xlsx';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [newOrder, setNewOrder] = useState({ productId: '', quantity: '', orderType: 'IN' });
    const [searchTerm, setSearchTerm] = useState("");

    const theme = { primary: '#2D3748', accent: '#F97316', bg: '#F8FAFC', success: '#10B981' };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const prodRes = await axios.get("http://localhost:8080/api/products");
            const orderRes = await axios.get("http://localhost:8080/api/orders");
            setProducts(prodRes.data);
            const sortedOrders = orderRes.data.sort((a, b) => b.id - a.id);
            setOrders(sortedOrders);
        } catch (err) { 
            console.error("Veri çekilemedi", err);
        }
    };

    const handleOrder = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/orders", {
                product: { id: parseInt(newOrder.productId) },
                quantity: parseInt(newOrder.quantity),
                orderType: newOrder.orderType,
                status: "COMPLETED"
            });
            toast.success("✅ Stok işlemi başarıyla kaydedildi!");
            setNewOrder({ productId: '', quantity: '', orderType: 'IN' });
            fetchData(); 
        } catch (err) { 
            toast.error("❌ İşlem Başarısız: " + (err.response?.data?.message || "Hata oluştu.")); 
        }
    };

    // --- YENİ: EXCEL İNDİRME FONKSİYONU ---
    const exportToExcel = () => {
        // 1. İndirilecek veriyi hazırla (Gereksiz detayları temizle)
        const dataToExport = filteredOrders.map(o => ({
            "İşlem ID": o.id,
            "Ürün Adı": o.product?.name,
            "SKU": o.product?.sku,
            "İşlem Tipi": o.orderType === 'IN' ? 'GİRİŞ' : 'ÇIKIŞ',
            "Adet": o.quantity,
            "Tarih": o.orderDate ? new Date(o.orderDate).toLocaleString('tr-TR') : '-'
        }));

        // 2. Çalışma sayfası oluştur
        const worksheet = XLSX.utils.json_to_sheet(dataToExport);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Siparişler");

        // 3. Dosyayı indir
        XLSX.writeFile(workbook, "Siparis_Raporu.xlsx");
        toast.success("📊 Rapor indirildi!");
    };
    // ---------------------------------------

    const filteredOrders = orders.filter(o => 
        o.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        o.orderType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const cardStyle = { backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '30px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' };
    const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' };
    const buttonStyle = (theme) => ({ backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '10px', padding: '15px', fontWeight: '800', cursor: 'pointer' });
    
    // Excel butonu stili
    const excelButtonStyle = {
        backgroundColor: theme.success,
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        padding: '8px 15px',
        fontWeight: '600',
        cursor: 'pointer',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px'
    };

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <h1 style={{ color: theme.primary, fontWeight: '800' }}>Sipariş & Sevkiyat</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '30px' }}>
                
                {/* SOL: FORM */}
                <div style={cardStyle}>
                    <h3 style={{ color: theme.accent }}>Yeni İşlem Kaydı</h3>
                    <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <select style={inputStyle} value={newOrder.productId} onChange={e => setNewOrder({ ...newOrder, productId: e.target.value })} required>
                            <option value="">Ürün Seçin</option>
                            {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                        <select style={inputStyle} value={newOrder.orderType} onChange={e => setNewOrder({ ...newOrder, orderType: e.target.value })}>
                            <option value="IN">Giriş (IN) - Stok Artır</option>
                            <option value="OUT">Çıkış (OUT) - Stok Azalt</option>
                        </select>
                        <input style={inputStyle} type="number" placeholder="Adet" value={newOrder.quantity} onChange={e => setNewOrder({ ...newOrder, quantity: e.target.value })} required />
                        <button type="submit" style={buttonStyle(theme)}>İŞLEMİ ONAYLA</button>
                    </form>
                </div>

                {/* SAĞ: GEÇMİŞ İŞLEMLER */}
                <div style={cardStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                        <h3 style={{ margin: 0, color: theme.primary }}>Son Hareketler</h3>
                        
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {/* --- EXCEL BUTONU --- */}
                            <button onClick={exportToExcel} style={excelButtonStyle} title="Listeyi İndir">
                                 Excel'e Aktar 🡕
                            </button>

                            <input type="text" placeholder="🔍 İşlem ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, padding: '8px', width: '150px', fontSize: '13px' }} />
                        </div>
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #E2E8F0', borderRadius: '8px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                            <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1, boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #E2E8F0' }}>
                                    <th style={{ padding: '12px' }}>ÜRÜN</th>
                                    <th>TİP</th>
                                    <th>ADET</th>
                                    <th style={{ textAlign: 'right', paddingRight: '15px' }}>TARİH</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredOrders.length > 0 ? (
                                    filteredOrders.map(o => (
                                        <tr key={o.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                            <td style={{ padding: '10px', fontWeight: '600' }}>{o.product?.name}</td>
                                            <td style={{ fontWeight: 'bold' }}>
                                                {o.orderType === 'IN' ? 
                                                    <span style={{ color: 'green', backgroundColor: '#def7ec', padding: '3px 8px', borderRadius: '5px', fontSize: '11px' }}>GİRİŞ</span> 
                                                    : 
                                                    <span style={{ color: 'red', backgroundColor: '#fde8e8', padding: '3px 8px', borderRadius: '5px', fontSize: '11px' }}>ÇIKIŞ</span>
                                                }
                                            </td>
                                            <td>{o.quantity}</td>
                                            <td style={{ fontSize: '12px', color: '#64748B', textAlign: 'right', paddingRight: '15px' }}>
                                                {o.orderDate ? new Date(o.orderDate).toLocaleString('tr-TR') : '-'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan="4" style={{ padding: '20px', textAlign: 'center', color: '#A0AEC0' }}>Kayıt bulunamadı.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
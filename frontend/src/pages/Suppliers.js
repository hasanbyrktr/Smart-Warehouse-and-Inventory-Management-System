import React, { useState, useEffect } from 'react';
import axios from 'axios';
// YENİ: Toast import
import { toast } from 'react-toastify';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [newSupplier, setNewSupplier] = useState({ name: '', contactPerson: '', email: '', phone: '' });
    const [searchTerm, setSearchTerm] = useState("");

    const theme = { primary: '#2D3748', accent: '#F97316', bg: '#F8FAFC', danger: '#E53E3E' };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/suppliers");
            // En son eklenen en üstte görünsün diye ters sıralama (id'ye göre)
            setSuppliers(res.data.sort((a, b) => b.id - a.id));
        } catch (err) { 
            console.error("Hata:", err); 
        }
    };

    const handleAddSupplier = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8080/api/suppliers", newSupplier);
            toast.success("✅ Tedarikçi başarıyla eklendi!");
            setNewSupplier({ name: '', contactPerson: '', email: '', phone: '' });
            fetchData();
        } catch (err) {
            toast.error("❌ Tedarikçi eklenirken hata oluştu.");
        }
    };

    const deleteSupplier = async (id) => {
        if (window.confirm("Bu tedarikçiyi silmek istediğinize emin misiniz?")) {
            try {
                await axios.delete(`http://localhost:8080/api/suppliers/${id}`);
                fetchData();
                toast.info("🗑️ Tedarikçi silindi.");
            } catch (err) {
                toast.warning("⛔ SİLİNEMEZ! Bu tedarikçiye bağlı ürünler var.");
            }
        }
    };

    // Arama Filtresi
    const filteredSuppliers = suppliers.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.contactPerson && s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (s.phone && s.phone.includes(searchTerm))
    );

    // Stiller
    const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
    const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' };
    const tableHeaderStyle = { textAlign: 'left', borderBottom: '2px solid #E2E8F0', fontSize: '12px', color: '#64748B' };
    const addButtonStyle = (theme) => ({ backgroundColor: theme.accent, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', padding: '15px' });
    const deleteButtonStyle = { padding: '8px 16px', backgroundColor: '#FFF5F5', color: theme.danger, border: '1px solid #FED7D7', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' };

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary, marginBottom: '40px' }}>Tedarikçi Yönetimi</h1>

            {/* EKLEME FORMU */}
            <div style={cardStyle}>
                <h4 style={{ color: theme.accent, marginBottom: '20px' }}>Yeni Tedarikçi Ekle</h4>
                <form onSubmit={handleAddSupplier} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                    <input style={inputStyle} placeholder="Firma Adı" value={newSupplier.name} onChange={e => setNewSupplier({ ...newSupplier, name: e.target.value })} required />
                    <input style={inputStyle} placeholder="Yetkili Kişi" value={newSupplier.contactPerson} onChange={e => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })} />
                    <input style={inputStyle} placeholder="E-posta" type="email" value={newSupplier.email} onChange={e => setNewSupplier({ ...newSupplier, email: e.target.value })} />
                    <input style={inputStyle} placeholder="Telefon" value={newSupplier.phone} onChange={e => setNewSupplier({ ...newSupplier, phone: e.target.value })} />
                    
                    <button type="submit" style={{ ...addButtonStyle(theme), gridColumn: '1 / -1' }}>KAYDET</button>
                </form>
            </div>

            {/* TABLO */}
            <div style={cardStyle}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: theme.primary }}>Tedarikçi Listesi</h3>
                    <input type="text" placeholder="🔍 Firma, Yetkili veya Tel ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, width: '300px', border: '1px solid #CBD5E0' }} />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={tableHeaderStyle}>
                            <th style={{ padding: '15px' }}>FİRMA ADI</th>
                            <th>YETKİLİ</th>
                            <th>TELEFON</th>
                            <th>E-POSTA</th>
                            <th style={{ textAlign: 'right', paddingRight: '20px' }}>İŞLEM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '18px 15px', fontWeight: '600' }}>{s.name}</td>
                                    <td>{s.contactPerson || '-'}</td>
                                    <td>{s.phone || '-'}</td>
                                    <td style={{ color: '#64748B' }}>{s.email || '-'}</td>
                                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                        <button onClick={() => deleteSupplier(s.id)} style={deleteButtonStyle}>
                                            <span>🗑️</span> Sil
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#A0AEC0' }}>Kayıt bulunamadı.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Suppliers;
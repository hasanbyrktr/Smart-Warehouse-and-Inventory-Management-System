import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Suppliers = () => {
    const [suppliers, setSuppliers] = useState([]);
    
    // DEĞİŞİKLİK BURADA: contactPerson -> contactName oldu
    const [formData, setFormData] = useState({ name: '', contactName: '', email: '', phone: '' });
    
    const [searchTerm, setSearchTerm] = useState("");
    const [editingId, setEditingId] = useState(null);

    const theme = { primary: '#2D3748', accent: '#F97316', bg: '#F8FAFC', danger: '#E53E3E', warning: '#D69E2E' };

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("http://localhost:8080/api/suppliers");
            setSuppliers(res.data.sort((a, b) => b.id - a.id));
        } catch (err) { console.error("Hata:", err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`http://localhost:8080/api/suppliers/${editingId}`, formData);
                toast.success("✅ Tedarikçi bilgileri güncellendi!");
            } else {
                await axios.post("http://localhost:8080/api/suppliers", formData);
                toast.success("✅ Yeni tedarikçi eklendi!");
            }
            // DEĞİŞİKLİK BURADA: Sıfırlarken de contactName kullanıyoruz
            setFormData({ name: '', contactName: '', email: '', phone: '' });
            setEditingId(null);
            fetchData();
        } catch (err) {
            toast.error("❌ İşlem başarısız! " + (err.response?.data?.message || "Hata oluştu."));
        }
    };

    const handleEditClick = (supplier) => {
        // DEĞİŞİKLİK BURADA: Backend'den gelen veriyi forma doldururken
        setFormData({
            name: supplier.name,
            contactName: supplier.contactName || '', // contactPerson -> contactName
            email: supplier.email || '',
            phone: supplier.phone || ''
        });
        setEditingId(supplier.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancel = () => {
        setFormData({ name: '', contactName: '', email: '', phone: '' }); // contactName
        setEditingId(null);
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

    const filteredSuppliers = suppliers.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        // DEĞİŞİKLİK BURADA: Arama yaparken de contactName
        (s.contactName && s.contactName.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Stiller (Aynı kaldı)
    const cardStyle = { backgroundColor: 'white', padding: '30px', borderRadius: '20px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
    const inputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' };
    const tableHeaderStyle = { textAlign: 'left', borderBottom: '2px solid #E2E8F0', fontSize: '12px', color: '#64748B' };
    const saveButtonStyle = { backgroundColor: editingId ? theme.warning : theme.accent, color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', padding: '15px' };
    const actionBtnStyle = (bgColor, color) => ({ padding: '6px 12px', backgroundColor: bgColor, color: color, border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px', marginRight: '8px' });

    return (
        <div style={{ padding: '40px 60px', backgroundColor: theme.bg, minHeight: '100vh' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '800', color: theme.primary, marginBottom: '40px' }}>Tedarikçi Yönetimi</h1>

            <div style={cardStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h4 style={{ color: editingId ? theme.warning : theme.accent, margin: 0 }}>
                        {editingId ? '✏️ Tedarikçiyi Düzenle' : '➕ Yeni Tedarikçi Ekle'}
                    </h4>
                    {editingId && (
                        <button onClick={handleCancel} style={{ padding: '5px 15px', backgroundColor: '#E2E8F0', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}>
                            ✖ Vazgeç
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                    <input style={inputStyle} placeholder="Firma Adı" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    
                    {/* INPUT NAME DEĞİŞTİ */}
                    <input style={inputStyle} placeholder="Yetkili Kişi" value={formData.contactName} onChange={e => setFormData({ ...formData, contactName: e.target.value })} />
                    
                    <input style={inputStyle} placeholder="E-posta" type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                    <input style={inputStyle} placeholder="Telefon" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    
                    <button type="submit" style={{ ...saveButtonStyle, gridColumn: '1 / -1' }}>
                        {editingId ? 'GÜNCELLEMEYİ KAYDET' : 'KAYDET'}
                    </button>
                </form>
            </div>

            <div style={cardStyle}>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, color: theme.primary }}>Tedarikçi Listesi</h3>
                    <input type="text" placeholder="🔍 Firma veya Yetkili ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={{ ...inputStyle, width: '300px', border: '1px solid #CBD5E0' }} />
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={tableHeaderStyle}>
                            <th style={{ padding: '15px' }}>FİRMA ADI</th>
                            <th>YETKİLİ</th>
                            <th>TELEFON</th>
                            <th>E-POSTA</th>
                            <th style={{ textAlign: 'right', paddingRight: '20px' }}>İŞLEMLER</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.length > 0 ? (
                            filteredSuppliers.map(s => (
                                <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                    <td style={{ padding: '18px 15px', fontWeight: '600' }}>{s.name}</td>
                                    {/* TABLODA GÖSTERİRKEN DEĞİŞTİ */}
                                    <td>{s.contactName || '-'}</td> 
                                    <td>{s.phone || '-'}</td>
                                    <td style={{ color: '#64748B' }}>{s.email || '-'}</td>
                                    <td style={{ textAlign: 'right', paddingRight: '20px' }}>
                                        <button onClick={() => handleEditClick(s)} style={actionBtnStyle('#FFFAF0', '#D69E2E')}>
                                            <span>✏️</span> Düzenle
                                        </button>
                                        <button onClick={() => deleteSupplier(s.id)} style={actionBtnStyle('#FFF5F5', '#E53E3E')}>
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
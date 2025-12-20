import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Stocks from './pages/Stocks';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import './App.css'; 

function App() {
  return (
    <Router>
      <div className="app-container" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        
        {/* SADECE SIDEBAR KALDI, NAVBAR SİLİNDİ */}
        <Sidebar />
        
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/* <Navbar />  <-- BURASI SİLİNDİ */}
          
          <div style={{ padding: '0', flex: 1 }}>
             <Routes>
               <Route path="/" element={<Dashboard />} />
               <Route path="/products" element={<Products />} />
               <Route path="/stocks" element={<Stocks />} />
               <Route path="/orders" element={<Orders />} />
               <Route path="/suppliers" element={<Suppliers />} />
             </Routes>
          </div>
        </div>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
    </Router>
  );
}

export default App;
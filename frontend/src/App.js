import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Stocks from './pages/Stocks';
import Orders from './pages/Orders';
import Suppliers from './pages/Suppliers';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ flex: 1, backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/suppliers" element={<Suppliers />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
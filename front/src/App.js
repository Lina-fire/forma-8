import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CatalogPage from './pages/CatalogPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import AtelierRequestPage from './pages/AtelierRequestPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import AdminRequestsPage from './pages/AdminRequestsPage';
import AdminProductsPage from './pages/AdminProductsPage';
import './App.css';

function App() {
  const { user } = useSelector(state => state.auth);
  const isAdmin = user?.role === 'admin';

  return (
    <BrowserRouter>
      <div className="app-background"></div>
      <div className="top-red-stripe"></div>
      <div className="bg-pattern"></div>
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        background: 'rgba(245, 240, 235, 0.9)',
        margin: 0,
        padding: 0
      }}>
        <Navbar />
        <main style={{ 
          flex: 1,
          margin: 0,
          padding: 0
        }}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/cart" element={user ? <CartPage /> : <Navigate to="/login" />} />
            <Route path="/favorites" element={user ? <FavoritesPage /> : <Navigate to="/login" />} />
            <Route path="/atelier" element={user ? <AtelierRequestPage /> : <Navigate to="/login" />} />
            <Route path="/admin/orders" element={isAdmin ? <AdminOrdersPage /> : <Navigate to="/catalog" />} />
            <Route path="/admin/requests" element={isAdmin ? <AdminRequestsPage /> : <Navigate to="/catalog" />} />
            <Route path="/admin/products" element={isAdmin ? <AdminProductsPage /> : <Navigate to="/catalog" />} />
            <Route path="/" element={<Navigate to="/catalog" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
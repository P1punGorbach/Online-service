// src/App.js
import React, { useState }        from 'react';
import { Routes, Route }          from 'react-router-dom';
import { CartProvider }           from './contexts/CartContext';
import Header                     from './components/Header';
import HomePage                   from './pages/HomePage';
import ProfilePage                from './pages/ProfilePage';
import ProductPage                from './pages/ProductPage';
import CategoryPage               from './pages/CategoryPage';
import LoginPage                  from './pages/LoginPage';
import Footer                     from './components/Footer';
import AdminDashboard  from './pages/admin/AdminDashboard';
import UserCreate from './pages/admin/UserCreate';      
import UsersManager from './pages/admin/UsersManager'; 
import SearchPage from './pages/SearchPage';
import ProductsManager from './pages/admin/ProductsManager';
import AdminRoute     from './pages/AdminRoute';
import { Navigate } from 'react-router-dom';
import CreatePickPage from './pages/CreatePickPage';
import { useNavigate } from 'react-router-dom';

import './App.css';

export default function App() {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const openLogin  = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  return (
    // 1) Оборачиваем всё в CartProvider
    <CartProvider>
      <div className="App">
        <Header onLoginClick={openLogin} />

        <main className="App__main">
          <Routes>
            <Route path="/"             element={<HomePage />} />
            <Route path="/profile"      element={<ProfilePage />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users"   element={<UsersManager />} />
              <Route path="products" element={<ProductsManager />} />
            </Route>
            <Route path="/product/:id"  element={<ProductPage />} />
            <Route path="/admin/users/new" element={<UserCreate />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/category" element = {<Navigate to="/" replace />} />
            <Route path="/create-pick" element={<CreatePickPage />} />
          </Routes>
        </main>

        <Footer />

        {showLogin && <LoginPage onClose={closeLogin}onLogin={user => navigate('/')} />}        
      </div>
    </CartProvider>
  );
}

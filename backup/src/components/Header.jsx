// src/components/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logoSrc from '../assets/logo.png';
import './Header.css';
import { useAuth } from '../contexts/authContext';

export default function Header({ onLoginClick }) {
  const navigate = useNavigate();
  const {user} = useAuth();
  const handleStubClick = () => {
    // пока просто переходим на заглушечную страницу
    navigate('/create-pick');
  };
  return (
    <header className="header">
      {/* === Верхняя полоса: logo + поиск + кнопка Войти === */}
      <div className="header-top">
        <Link to="/" className="logo-link">
          <img src={logoSrc} alt="Логотип" className="logo-img" />
        </Link>

        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Поиск..."
          />
          <button className="search-btn">Поиск</button>
        </div>

        
        {user != null ? (
          <button className="login-btn" onClick={() => navigate('/profile')}>
            Профиль
          </button>
        ) : 
        <button className="login-btn" onClick={onLoginClick}>
          Войти
        </button>}
        <button
          className="stub-btn"
          onClick={handleStubClick}
        >
          Создать подбор кроссовок
        </button>
      </div>

      {/* === Нижняя полоса: навигация по категориям === */}
      <nav className="header-nav">
      <Link to="/category/sneakers">Кроссовки</Link>
        <Link to="/category/balls">Мячи</Link>
        <Link to="/category/clothes">Одежда</Link>
        <Link to="/category/accessories">Аксессуары</Link>
      </nav>
    </header>
  );
}

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './contexts/authContext';
// Импорты стилей slick, если вы их используете для каруселей
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { BrowserRouter } from 'react-router-dom';   // ← добавляем обёртку маршрутизатора
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> 
    <BrowserRouter>        {/* оборачиваем всё приложение */}
      <App />
    </BrowserRouter>
    </AuthProvider> 
  </React.StrictMode>
);

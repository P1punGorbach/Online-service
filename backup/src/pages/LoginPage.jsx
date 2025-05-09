// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import './LoginPage.css';

export default function LoginPage({ onClose, onLogin }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [error, setError]         = useState('');

  const toggleMode = () => {
    setError('');
    setIsRegister(prev => !prev);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    // при регистрации проверяем совпадение паролей
    if (isRegister && password !== confirm) {
      setError('Пароли не совпадают');
      return;
    }

    const url = isRegister ? '/api/register' : '/api/login';
    const payload = {
      email,
      password,
      ...(isRegister ? { confirmPassword: confirm } : {})
    };

    try {
      const res = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Что-то пошло не так');
        return;
      }

      onLogin(data);
      onClose();
    } catch (err) {
      console.error(err);
      setError('Ошибка соединения. Попробуйте снова.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <button className="close-btn" onClick={onClose}>×</button>

        <h2>{isRegister ? 'Регистрация' : 'Войти'}</h2>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Поле email */}
          <label>
            Электронная почта
            <input
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </label>
          <label>
            Пароль
            <input
              name="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </label>

          {isRegister && (
            <label>
              Повторите пароль
              <input
                name="confirm"
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
              />
            </label>
          )}

          <button type="submit" className="btn submit-btn">
            {isRegister ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </form>

        <div className="toggle-line">
          {isRegister ? (
            <>
              Уже есть аккаунт?{' '}
              <button onClick={toggleMode} className="link-btn">
                Войти
              </button>
            </>
          ) : (
            <>
              Нет аккаунта?{' '}
              <button onClick={toggleMode} className="link-btn">
                Зарегистрироваться
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

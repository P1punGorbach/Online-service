// src/pages/ProfilePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate }                 from 'react-router-dom';
import './ProfilePage.css';
import { useAuth } from '../contexts/authContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const setUser = useCallback(()=>{},[user]);
  // 1) Локальный user и его апдейт
  // const [user, setUser] = useState({
  //   name:     'Александр Сухобаевский',
  //   email:    'alex@example.com',
  //   gender:   'male',
  //   height:   185,
  //   weight:   83,
  //   position: 'Нападающий'
  // });

  // 2) Массив "последних подборов"
  const [lastPicks] = useState([
    { id: 1, title: 'Кроссовки Nike Air Zoom', date: '2025-04-10' },
    { id: 2, title: 'Мяч Spalding Pro',          date: '2025-04-08' },
    { id: 3, title: 'Трико Jordan Classic',      date: '2025-04-05' },
    { id: 4, title: 'Аксессуары: Щитки',         date: '2025-04-02' },
    { id: 5, title: 'Комплект формы',            date: '2025-03-30' },
  ]);

  // 3) Режим редактирования и данные формы
  const [isEditing, setIsEditing] = useState(false);
  const [formData,   setFormData]   = useState({ ...user });

  // 4) При user === null — редирект домой
  useEffect(() => {
    if (user === null) {
      navigate('/');
    }
  }, [user, navigate]);

  // Универсальный onChange для полей
  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveChanges = () => {
    setUser({ ...formData });
    setIsEditing(false);
  };
  const cancelEdit = () => {
    setFormData({ ...user });
    setIsEditing(false);
  };

  // Выход из аккаунта
  const handleLogout = () => {
    setUser(null);
  };

  // Если юзера нет — не рисуем ничего (useEffect сделает navigate)
  if (!user) return null;

  return (
    <div className="container profile-page">
      <h1 className="profile-title">Ваш профиль</h1>

      <div className="profile-content">
        {/* левая колонка */}
        <div className="profile-block user-data">
          {!isEditing ? (
            <>
              <p><strong>Имя:</strong> {user.name}</p>
              <p><strong>Почта:</strong> {user.email}</p>
              <p><strong>Рост:</strong> {user.height} см</p>
              <p><strong>Вес:</strong> {user.weight} кг</p>
              <p><strong>Позиция:</strong> {user.position}</p>

              <button
                className="btn-edit"
                onClick={() => setIsEditing(true)}
              >
                Изменить данные
              </button>
              <button
                className="btn-edit"
                onClick={handleLogout}
              >
                Выйти
              </button>             
              {user.is_admin && (
        <button className="btn-edit" onClick={() => navigate('/admin')}>
          Перейти в панель администратора
        </button>
      )}
            </>
            
          ) : (
            <form
              className="edit-form"
              onSubmit={e => { e.preventDefault(); saveChanges(); }}
            >
              <label>
                Имя
                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>

              <label>
                Почта
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>

              <label>
                Рост, см
                <input
                  name="height"
                  type="number"
                  value={formData.height}
                  onChange={handleChange}
                />
              </label>

              <label>
                Вес, кг
                <input
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                />
              </label>

              <label>
                Позиция
                <select
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                      >
                        <option value="Нападающий">Нападающий</option>
                        <option value="Защитник">Защитник</option>
                        <option value="Полузащитник">Полузащитник</option>
                        <option value="Вратарь">Вратарь</option>
                      </select>
              </label>

              <div className="form-buttons">
                <button className="btn-save" type="submit">
                  Сохранить
                </button>
                <button className="btn-cancel" type="button" onClick={cancelEdit}>
                  Отмена
                </button>
              </div>
            </form>
          )}
        </div>

        {/* правая колонка */}
        <div className="profile-block last-picks">
          <h2>Последние подборы</h2>
          <ul>
            {lastPicks.map(pick => (
              <li key={pick.id}>
                <span className="pick-title">{pick.title}</span>
                <span className="pick-date">{pick.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

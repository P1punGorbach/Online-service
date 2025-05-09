// src/pages/ProductPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams }                from 'react-router-dom';
import './ProductPage.css';
import frontImg from '../assets/front.jpg';
import sideImg  from '../assets/side.jpg';
import backImg  from '../assets/back.jpg';
// Пока что мок, позже замените на запрос к вашему API
const MOCK_PRODUCTS = [
  {
    id: 1,
    title: 'Nike Air Max 270',
    category: 'sneakers',
    description: 'Новая модель Nike Air Max 270 с максимальной воздушной подушкой…',
    images: [
      frontImg,
      sideImg,
      backImg,
      // '/src/assets/front.jpg',
      // '/src/assets/side.jpg',
      // '/images/airmax/back.jpg',
    ],
    shops: [
      { id: 'ozon',  name: 'Ozon',         price: '12 999 ₽', url: 'https://ozon.ru/...' },
      { id: 'wild',  name: 'Wildberries', price: '13 499 ₽', url: 'https://wb.ru/...' },
      { id: 'sport', name: 'Sportmaster', price: '13 200 ₽', url: 'https://sportmaster.ru/...' },
    ],
    reviews: [
      { id: 1, user: 'Иван',  rating: 5, text: 'Очень классные кроссовки, нога дышит и не устаёт.' },
      { id: 2, user: 'Ольга', rating: 4, text: 'Удобные, но маломерят на полразмера.' },
      { id: 3, user: 'Павел', rating: 5, text: 'Отлично подошли для игры в зале и на улице.' }
    ]
  },
  // … другие товары
];

export default function ProductPage() {
  const { id } = useParams();

  // Основной стейт товара
  const [product, setProduct]     = useState(null);
  const [mainImage, setMainImage] = useState('');

  // Стейт отзывов и формы
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    user: '',
    rating: 5,
    text: ''
  });

  // При монтировании подгружаем товар из MOCK
  useEffect(() => {
    const prod = MOCK_PRODUCTS.find(p => String(p.id) === id);
    setProduct(prod);
    if (prod) {
      setMainImage(prod.images[0]);
      setReviews(prod.reviews || []);
    }
  }, [id]);

  // Универсальный onChange для полей формы
  const onChangeField = (field, value) => {
    setNewReview(prev => ({ ...prev, [field]: value }));
  };

  // Отправка формы — просто пушим в локальный массив
  const handleSubmitReview = e => {
    e.preventDefault();
    const review = {
      id: Date.now(),
      user: newReview.user.trim() || 'Аноним',
      rating: Number(newReview.rating),
      text: newReview.text.trim()
    };
    setReviews(prev => [review, ...prev]);
    setNewReview({ user: '', rating: 5, text: '' });
  };

  if (!product) return <p className="loading">Загрузка товара…</p>;

  return (
    <div className="product-page">
      <div className="product-content">
        <div className="product-top">
          <div className="gallery">
            <div className="main-img">
              <img src={mainImage} alt={product.title} />
            </div>
            <div className="thumbs">
              {product.images.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${product.title} ${i + 1}`}
                  className={src === mainImage ? 'active' : ''}
                  onClick={() => setMainImage(src)}
                />
              ))}
            </div>
          </div>
          <div className="details">
            <h1>{product.title}</h1>
            <p>{product.description}</p>
          </div>
        </div>

        <div className="shops-list">
          {product.shops.map(shop => (
            <div key={shop.id} className="shop-row">
              <span className="shop-name">{shop.name}</span>
              <span className="shop-price">{shop.price}</span>
              <a
                className="shop-btn"
                href={shop.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Перейти
              </a>
            </div>
          ))}
        </div>

        <section className="reviews">
          <h2>Отзывы</h2>
          <form className="review-form" onSubmit={handleSubmitReview}>
            <input
              type="text"
              placeholder="Ваше имя"
              value={newReview.user}
              onChange={e => onChangeField('user', e.target.value)}
            />
            <select
              value={newReview.rating}
              onChange={e => onChangeField('rating', e.target.value)}
            >
              {[5,4,3,2,1].map(n => (
                <option key={n} value={n}>{n} ★</option>
              ))}
            </select>
            <textarea
              placeholder="Ваш отзыв"
              value={newReview.text}
              onChange={e => onChangeField('text', e.target.value)}
            />
            <button type="submit">Отправить</button>
          </form>

          <ul className="review-list">
            {reviews.map(r => (
              <li key={r.id} className="review-card">
                <div className="review-header">
                  <strong>{r.user}</strong>
                  <span className="stars">
                    {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                  </span>
                </div>
                <p>{r.text}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

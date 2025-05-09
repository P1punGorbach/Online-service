import React from 'react';
import './ProductCard.css';

export default function ProductCard({ title, price, imageUrl }) {
  return (
    <div className="product-card">
      {/* тут тоже совпадает с CSS */}
      <img src={imageUrl} alt={title} className="product-card__img" />
      <div className="product-card__info">
        <h3 className="product-card__title">{title}</h3>
        <p className="product-card__price">от {price}</p>
      </div>
    </div>
  );
}
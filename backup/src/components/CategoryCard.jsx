import React from 'react';
import './CategoryCard.css';

export default function CategoryCard({ title, imageUrl }) {
  return (
    <div className="category-card">
      {/* используем класс, который прописан в CSS */}
      <img src={imageUrl} alt={title} className="category-card__img" />
      <h3 className="category-card__title">{title}</h3>
    </div>
  );
}


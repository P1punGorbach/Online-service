// src/components/SortDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import './SortDropdown.css';

const OPTIONS = [
  { label: 'Сначала новые',      value: 'new' },
  { label: 'Сначала дешёвые',    value: 'asc' },
  { label: 'Сначала дорогие',    value: 'desc' },
];

export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  // Закрыть дропдаун по клику вне
  useEffect(() => {
    const onClickOutside = e => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  const current = OPTIONS.find(o => o.value === value) || OPTIONS[0];

  return (
    <div className="sort-dropdown" ref={ref}>
      {/* Кнопка, показывающая текущее значение */}
      <button
        type="button"
        className="sort-dropdown__button"
        onClick={() => setOpen(o => !o)}
      >
        {current.label}
        <span className={`arrow ${open ? 'up' : 'down'}`}></span>
      </button>

      {/* Выпадающий список */}
      {open && (
        <ul className="sort-dropdown__list">
          {OPTIONS.map(opt => (
            <li key={opt.value}>
              <button
                className="sort-dropdown__item"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

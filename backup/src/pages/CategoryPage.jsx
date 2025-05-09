import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SortDropdown from '../components/SortDropdown';
import './CategoryPage.css';
import NikeMax from '../assets/front.jpg';
import Harden  from '../assets/harden.jpg';
import Molten from '../assets/molten.jpg';
import Spalding  from '../assets/spalding.jpg';

// Описываем, какие секции фильтров для каждой категории
const FILTER_SECTIONS = {
  sneakers: [
    { key: 'brand', title: 'Бренд', options: ['Nike', 'Adidas', 'Puma'] },
  ],
  balls: [
    { key: 'brand', title: 'Бренд', options: ['Spalding', 'Molten', 'Wilson'] },
    { key: 'size',  title: 'Размер мяча', options: ['5', '6', '7'] },
  ],
  clothes: [
    { key: 'tops',   title: 'Верх',  options: ['Майки', 'Лонгсливы', 'Футболки'] },
    { key: 'bottoms',title: 'Низ',   options: ['Шорты', 'Брюки', 'Компрессионное'] },
    { key: 'socks',  title: 'Носки', options: ['Спортивные', 'Компрессия'] },
  ],
  accessories: [
    { key: 'cases',  title: 'Чехлы/Футляры', options: ['Телефон', 'Очки'] },
    { key: 'others', title: 'Прочее',         options: ['Брелоки', 'Повязки'] },
  ],
};

// Мок-данные товаров
const ALL_PRODUCTS = [
  { id:1, category:'sneakers', title:'Nike Air Max',     brand:'Nike',     price:120, image: NikeMax },
  { id:2, category:'sneakers', title:'Adidas Harden vol 8', brand:'Adidas',   price:100, image: Harden  },
  { id:3, category:'balls',    title:'Spalding NBA',     brand:'Spalding', price: 30, image: Spalding    },
  { id:4, category:'balls',    title:'Molten Elite',     brand:'Molten',   price: 35, image: Molten    },
  { id:5, category:'clothes',  title:'Jordan Tee',       brand:'Jordan',   price: 45, image:'/img/tee1.jpg'     },
  // …
];

export default function CategoryPage() {
  const { id: categoryId } = useParams();
  const sections = FILTER_SECTIONS[categoryId] || [];

  // состояния
  const [open,    setOpen]    = useState(
    sections.reduce((acc, s) => (acc[s.key] = true, acc), {})
  );
  const [values,  setValues]  = useState({});
  const [sort,    setSort]    = useState('new');
  const [products,setProducts]= useState([]);

  // фильтруем/сортируем при изменении
  useEffect(() => {
    let list = ALL_PRODUCTS.filter(p => p.category === categoryId);

    // каждая секция
    sections.forEach(({ key }) => {
      const sel = values[key];
      if (sel && sel.length) {
        list = list.filter(p => sel.includes(p[key] || p.brand));
      }
    });

    // сортировка
    list.sort((a,b) => {
      if (sort==='new') return b.id - a.id;
      if (sort==='asc') return a.price - b.price;
      return b.price - a.price;
    });

    setProducts(list);
  }, [categoryId, values, sort]);

  // переключить секцию
  const toggle = k => setOpen(o => ({ ...o, [k]: !o[k] }));

  // выбрать/снять опцию
  const toggleOpt = (key, opt) => {
    setValues(v => {
      const prev = v[key]||[];
      const next = prev.includes(opt)
        ? prev.filter(x=>x!==opt)
        : [...prev, opt];
      return { ...v, [key]: next };
    });
  };

  return (
    <div className="category-page container">
      <h1 className="category-title">
        {categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}
      </h1>

      <div className="category-content">
        {/* SIDEBAR */}
        <aside className="filters">
          {sections.map(({ key, title, options }) => (
            <div className="filter-section" key={key}>
              <div className="filter-header" onClick={()=>toggle(key)}>
                <span>{title}</span>
                <span className={`arrow ${open[key] ? 'open': ''}`}/>
              </div>
              {open[key] && (
                <ul className="filter-options">
                  {options.map(opt=>(
                    <li key={opt}>
                      <label>
                        <input
                          type="checkbox"
                          checked={values[key]?.includes(opt) || false}
                          onChange={()=>toggleOpt(key,opt)}
                        />
                        {opt}
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <button className="apply-btn" onClick={()=>{/* здесь ваша логика_apply */}}>
            Применить
          </button>
        </aside>

        {/* MAIN + SORT */}
        <section className="products">
          <div className="sort-bar">
            <span>Сортировать:</span>
            <SortDropdown value={sort} onChange={setSort}/>
          </div>

          {products.length === 0
            ? <p>Товаров не найдено.</p>
            : (
              <div className="grid">
                {products.map(p=>(
                  <Link to={`/product/${p.id}`} key={p.id} className="product-card">
                    <img src={p.image} alt={p.title} className="product-card__img"/>
                    <div className="product-info">
                      <h4>{p.title}</h4>
                      <div className="meta">
                        <span className="brand">{p.brand}</span>
                        <span className="price">{p.price} ₽</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )
          }
        </section>
      </div>
    </div>
  );
}

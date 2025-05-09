// src/pages/HomePage.jsx
import React from 'react';
import Slider from 'react-slick';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';
import CategoryCard from '../components/CategoryCard';
import ProductCard  from '../components/ProductCard';
import './HomePage.css';
import krossImg from '../assets/kross.jpg';
import ballImg  from '../assets/ball.jpg';
import clothImg from '../assets/cloth.jpg';
import accImg   from '../assets/accessories.jpg';
import lebron   from '../assets/lebron.jpg';
import harden   from '../assets/harden.jpg';
import jordan   from '../assets/jordan.jpg';
import wow10    from '../assets/wow10.jpg';

const categories = [
  { title: 'Кроссовки',  imageUrl: krossImg  },
  { title: 'Мячи',       imageUrl: ballImg   },
  { title: 'Одежда',     imageUrl: clothImg  },
  { title: 'Аксессуары', imageUrl: accImg    },
];

const popular = [
  {  title:'Nike Lebron 22',     price:'$129.99', imageUrl: lebron },
  {  title:'Adidas Harden vol 8', price:'$49.99',  imageUrl: harden  },
  {  title:'Air Jordan 36',   price:'$39.99', imageUrl: jordan  },
  {  title:'Li Ning Wow 10', price:'$79.99', imageUrl: wow10  },
];

export default function HomePage() {
  const catSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  const prodSettings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 960,  settings: { slidesToShow: 2 } },
      { breakpoint: 600,  settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        py: 4 
      }}
    >
      {/* Заголовок раздела */}
      <Typography variant="h4" align="left" gutterBottom>
        Категории
      </Typography>
  
      {/* Карусель категорий */}
      <Box sx={{ width: '130%', mb: 6 }}>
        <Slider {...catSettings}>
          {categories.map(cat => (
            <Box 
              key={cat.id} 
              sx={{ px: 1, display: 'flex', justifyContent: 'center' }}
            >
               <CategoryCard
          title={cat.title}
          imageUrl={cat.imageUrl}/>
            </Box>
          ))}
        </Slider>
      </Box>
  
      {/* Заголовок раздела */}
      <Typography variant="h4" align="left" gutterBottom>
        Популярные товары
      </Typography>
  
      {/* Карусель популярных товаров */}
      <Box sx={{ width: '120%' }}>
        <Slider {...prodSettings}>
          {popular.map(prod => (
            <Box 
              key={prod.id} 
              sx={{ px: 1, display: 'flex', justifyContent: 'center' }}
            >
             <ProductCard
          title={prod.title}
          price={prod.price}
          imageUrl={prod.imageUrl}  // тоже обязательный проп
        /> 
            </Box>
          ))}
        </Slider>
      </Box>
    </Container>
  );
}
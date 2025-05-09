// src/pages/SearchPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Grid,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/authContext';

const CATEGORIES = [
  { value: 'sneakers', label: 'Кроссовки' },
  { value: 'balls',    label: 'Мячи' },
  { value: 'clothes',  label: 'Одежда' },
  { value: 'accessory',label: 'Аксессуары' },
];

const BRANDS = ['Nike', 'Adidas', 'Puma', 'Under Armour'];

const POSITIONS = [
  'Защитник',
  'Разыгрывающий',
  'Форвард',
  'Центровой',
];

const CLOTHING_TOP = ['Майки','Лонгсливы','Футболки'];
const CLOTHING_BOTTOM = ['Шорты','Брюки','Компрессионное','Носки'];
const ACCESSORY_TYPES = ['Чехлы (телефон)','Чехлы (очки)','Брелоки','Повязки'];

export default function SearchPage() {
  const { user } = useContext(useAuth) || {};

  // общие фильтры
  const [category, setCategory]   = useState('');
  const [brands,   setBrands]     = useState([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [description, setDescription] = useState('');

  // динамические подфильтры
  const [height, setHeight]   = useState('');
  const [weight, setWeight]   = useState('');
  const [position, setPosition] = useState('');
  const [ballSize, setBallSize] = useState('');
  const [clothTop,    setClothTop]    = useState('');
  const [clothBottom, setClothBottom] = useState('');
  const [accessoryType, setAccessoryType] = useState('');

  // результаты
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  // handler брендов
  const handleToggleBrand = brand => {
    setBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handleApplyFilters = async () => {
    setLoading(true);
    setError(null);

    // строим query params
    const params = new URLSearchParams();
    if (category)   params.append('category', category);
    if (brands.length) params.append('brands', brands.join(','));
    params.append('price_min', priceRange[0]);
    params.append('price_max', priceRange[1]);
    if (description) params.append('q', description);

    // динамика по категориям
    if (category === 'sneakers') {
      if (height)   params.append('height', height);
      if (weight)   params.append('weight', weight);
      if (position) params.append('position', position);
    }
    if (category === 'balls') {
      if (ballSize) params.append('size', ballSize);
    }
    if (category === 'clothes') {
      if (clothTop)    params.append('top', clothTop);
      if (clothBottom) params.append('bottom', clothBottom);
    }
    if (category === 'accessory') {
      if (accessoryType) params.append('type', accessoryType);
    }

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      if (!res.ok) throw new Error(`Сервер ответил ${res.status}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ my: 4 }}>
      <Grid container spacing={2}>
        {/* Фильтры */}
        <Grid item xs={12} md={3}>
          <Box sx={{ display:'flex', flexDirection:'column', gap:2 }}>
            {/* Категория */}
            <FormControl fullWidth>
              <InputLabel>Категория</InputLabel>
              <Select
                value={category}
                label="Категория"
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(cat => (
                  <MenuItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Динамические поля */}
            {category === 'sneakers' && (
              <>
                <TextField
                  type="number"
                  label="Рост, см"
                  value={height}
                  onChange={e => setHeight(e.target.value)}
                />
                <TextField
                  type="number"
                  label="Вес, кг"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                />
                <FormControl fullWidth>
                  <InputLabel>Позиция</InputLabel>
                  <Select
                    value={position}
                    label="Позиция"
                    onChange={e => setPosition(e.target.value)}
                  >
                    {POSITIONS.map(p=>(
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            {category === 'balls' && (
              <TextField
                type="number"
                label="Размер мяча"
                value={ballSize}
                onChange={e => setBallSize(e.target.value)}
              />
            )}
            {category === 'clothes' && (
              <>
                <FormControl fullWidth>
                  <InputLabel>Верх</InputLabel>
                  <Select
                    value={clothTop}
                    label="Верх"
                    onChange={e=>setClothTop(e.target.value)}
                  >
                    {CLOTHING_TOP.map(x=>(
                      <MenuItem key={x} value={x}>{x}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Низ</InputLabel>
                  <Select
                    value={clothBottom}
                    label="Низ"
                    onChange={e=>setClothBottom(e.target.value)}
                  >
                    {CLOTHING_BOTTOM.map(x=>(
                      <MenuItem key={x} value={x}>{x}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </>
            )}
            {category === 'accessory' && (
              <FormControl fullWidth>
                <InputLabel>Тип аксессуара</InputLabel>
                <Select
                  value={accessoryType}
                  label="Тип аксессуара"
                  onChange={e=>setAccessoryType(e.target.value)}
                >
                  {ACCESSORY_TYPES.map(x=>(
                    <MenuItem key={x} value={x}>{x}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {/* Цена */}
            <Box>
              <Typography gutterBottom>Цена, ₽</Typography>
              <Slider
                value={priceRange}
                onChange={(_, v) => setPriceRange(v)}
                min={0}
                max={20000}
                step={100}
                valueLabelDisplay="auto"
              />
            </Box>

            {/* Бренд */}
            <Box>
              <Typography>Бренд</Typography>
              <FormGroup>
                {BRANDS.map(br=>(
                  <FormControlLabel
                    key={br}
                    control={
                      <Checkbox
                        checked={brands.includes(br)}
                        onChange={()=>handleToggleBrand(br)}
                      />
                    }
                    label={br}
                  />
                ))}
              </FormGroup>
            </Box>

            {/* Применить */}
            <Button
              variant="contained"
              onClick={handleApplyFilters}
              disabled={!user}
            >
              Применить фильтр
            </Button>
          </Box>
        </Grid>

        {/* Результаты */}
        <Grid item xs={12} md={9}>
          {loading && <CircularProgress />}
          {error && (
            <Typography color="error" gutterBottom>
              Ошибка: {error}
            </Typography>
          )}
          {!loading && !error && products.length === 0 && (
            <Typography>Ничего не найдено.</Typography>
          )}
          <Grid container spacing={2}>
            {products.map(p => (
              <Grid item key={p.id} xs={12} sm={6} md={4}>
                <Card>
                  {p.image_url && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={p.image_url}
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle1">
                      {p.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {p.brand}
                    </Typography>
                    <Typography variant="h6">
                      {p.price} ₽
                    </Typography>
                    {p.old_price && (
                      <Typography
                        variant="body2"
                        sx={{ textDecoration:'line-through' }}
                        color="text.secondary"
                      >
                        {p.old_price} ₽
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

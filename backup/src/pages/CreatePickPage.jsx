// src/pages/CreatePickPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/authContext';

export default function CreatePickPage() {
  // Если у вас есть контекст с профилем — подтянем оттуда дефолты
  const { user } = useAuth(useAuth);
  
  // поля формы
  const [height,  setHeight]  = useState(user?.height  || '');
  const [weight,  setWeight]  = useState(user?.weight  || '');
  const [position,setPosition]= useState(user?.position|| '');

  // состояние результатов
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/picks?height=${height}&weight=${weight}&position=${position}`
      );
      if (!res.ok) throw new Error(`Ошибка сервера ${res.status}`);
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
    <Container maxWidth="md" sx={{ mt:4 }}>
      <Typography variant="h5" gutterBottom>
        Создать подбор экипировки
      </Typography>
       {/* Если не залогинен — показываем предупреждение */}
       {user && (
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'grid', gap: 2, mb: 4 }}
        >
          <TextField
            label="Рост, см"
            type="number"
            value={height}
            onChange={e => setHeight(e.target.value)}
            required
          />
          <TextField
            label="Вес, кг"
            type="number"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            required
          />
          <FormControl required>
            <InputLabel>Игровая позиция</InputLabel>
            <Select
            value={position}
            label="Игровая позиция"
            onChange={e => setPosition(e.target.value)}
            >
            <MenuItem value={1}>Разыгрывающий</MenuItem>
            <MenuItem value={2}>Атакующий защитник</MenuItem>
            <MenuItem value={3}>Лёгкий форвард</MenuItem>
            <MenuItem value={4}>Тяжёлый форвард</MenuItem>
            <MenuItem value={5}>Центровой</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" type="submit">
            Выполнить подбор
          </Button>
          {!loading && !error && products.length === 0 && (
        <Typography align="center">Пока нет результатов.</Typography>
      )}
        </Box>
      )|| (
       
      <Typography color="warning.main" sx={{ mb: 2 }}>
          Чтобы использовать эту функцию, необходимо войти в аккаунт.
        </Typography>
        )}
        {/* Результаты */}
      {loading && (
        <Box textAlign="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {!loading && !error && products.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom>
            Найдено товаров: {products.length}
          </Typography>
          <Grid container spacing={2}>
            {products.map(prod => (
              <Grid item key={prod.id} xs={12} sm={6} md={4}>
                <Card>
                  {prod.image_url && (
                    <CardMedia
                      component="img"
                      height="140"
                      image={prod.image_url}
                      alt={prod.name}
                    />
                  )}
                  <CardContent>
                    <Typography variant="subtitle1">
                      {prod.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {prod.brand}
                    </Typography>
                    <Typography variant="h6">
                      {prod.price} ₽
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      
    </Container>
  );
}

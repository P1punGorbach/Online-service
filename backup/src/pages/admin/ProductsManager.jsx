// src/pages/admin/ProductsManager.jsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Button,
} from '@mui/material'

export default function ProductsManager() {
  const [categories, setCategories] = useState([ 
    { id: 1, name: 'Кроссовки', slug: 'sneakers' },
    { id: 2, name: 'Мячи', slug: 'balls' },
    { id: 3, name: 'Одежда', slug: 'clothing' },
    { id: 4, name: 'Аксессуары', slug: 'accessories' },])
  const [brands, setBrands] = useState([])
  const [positions, setPositions] = useState([
    { id: 1, name: 'Разыгрывающий защитник' },
    { id: 2, name: 'Атакующий защитник' },
    { id: 3, name: 'Лёгкий форвард' },
    { id: 4, name: 'Тяжёлый форвард' },
    { id: 5, name: 'Центровой' },])

  const [form, setForm] = useState({
    categoryId: '',
    name: '',
    brandId: '',
    price: '',
    description: '',
    growthMin: '',
    growthMax: '',
    weightMin: '',
    weightMax: '',
    positionIds: [],
    ballSize: '',
    topType: '',
    bottomType: '',
    accessoryType: '',
  })

  useEffect(() => {
    Promise.all([
      fetch('/api/categories').then(r => r.json()),
      fetch('/api/brands').then(r => r.json()),
      fetch('/api/positions').then(r => r.json()),
    ]).then(([cats, brs, pos]) => {
      setCategories(cats)
      setBrands(brs)
      setPositions(pos)
    }).catch(console.error)
  }, [])

  const onChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const onMultiChange = e => {
    setForm(f => ({
      ...f,
      positionIds: e.target.value,
    }))
  }

  const onSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error(res.statusText)
      alert('Товар создан')
    } catch (err) {
      console.error(err)
      alert('Ошибка при создании товара')
    }
  }

  const selectedCat = categories.find(c => c.id === +form.categoryId)
  const slug = selectedCat?.slug

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Добавить товар
      </Typography>
      <Box component="form" onSubmit={onSubmit} sx={{ display: 'grid', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Категория</InputLabel>
          <Select
            name="categoryId"
            value={form.categoryId}
            onChange={onChange}
            label="Категория"
            required
          >
            {categories.map(c => (
              <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Название"
          name="name"
          value={form.name}
          onChange={onChange}
          fullWidth
          required
        />

        <FormControl fullWidth>
          <InputLabel>Бренд</InputLabel>
          <Select
            name="brandId"
            value={form.brandId}
            onChange={onChange}
            label="Бренд"
            required
          >
            {brands.map(b => (
              <MenuItem key={b.id} value={b.id}>{b.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Цена"
          name="price"
          type="number"
          inputProps={{ min: 0, step: 0.01 }}
          value={form.price}
          onChange={onChange}
          fullWidth
          required
        />

        <TextField
          label="Описание"
          name="description"
          value={form.description}
          onChange={onChange}
          fullWidth
          multiline
          rows={3}
        />

        {slug === 'sneakers' && (
          <>
            <Typography variant="h6">Параметры кроссовок</Typography>
            <TextField
              label="Рост от (см)"
              name="growthMin"
              type="number"
              value={form.growthMin}
              onChange={onChange}
              required
            />
            <TextField
              label="Рост до (см)"
              name="growthMax"
              type="number"
              value={form.growthMax}
              onChange={onChange}
              required
            />
            <TextField
              label="Вес от (кг)"
              name="weightMin"
              type="number"
              value={form.weightMin}
              onChange={onChange}
              required
            />
            <TextField
              label="Вес до (кг)"
              name="weightMax"
              type="number"
              value={form.weightMax}
              onChange={onChange}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Игровые позиции</InputLabel>
              <Select
                multiple
                name="positionIds"
                value={form.positionIds}
                onChange={onMultiChange}
                input={<OutlinedInput label="Игровые позиции" />}
                renderValue={selected => positions
                  .filter(p => selected.includes(p.id.toString()))
                  .map(p => p.name).join(', ')}
              >
                {positions.map(p => (
                  <MenuItem key={p.id} value={p.id.toString()}>
                    <Checkbox checked={form.positionIds.includes(p.id.toString())} />
                    <ListItemText primary={p.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </>
        )}

        {slug === 'balls' && (
          <TextField
            label="Размер мяча"
            name="ballSize"
            value={form.ballSize}
            onChange={onChange}
            required
          />
        )}

        {slug === 'clothing' && (
          <>
            <Typography variant="h6">Параметры одежды</Typography>
            <FormControl fullWidth>
              <InputLabel>Верх</InputLabel>
              <Select
                name="topType"
                value={form.topType}
                onChange={onChange}
                label="Верх"
              >
                <MenuItem value="">—</MenuItem>
                <MenuItem value="tank">Майка</MenuItem>
                <MenuItem value="tshirt">Футболка</MenuItem>
                <MenuItem value="longsleeve">Лонгслив</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Низ</InputLabel>
              <Select
                name="bottomType"
                value={form.bottomType}
                onChange={onChange}
                label="Низ"
              >
                <MenuItem value="">—</MenuItem>
                <MenuItem value="shorts">Шорты</MenuItem>
                <MenuItem value="pants">Брюки</MenuItem>
                <MenuItem value="compression">Компрессионное</MenuItem>
                <MenuItem value="socks">Носки</MenuItem>
              </Select>
            </FormControl>
          </>
        )}

        {slug === 'accessories' && (
          <FormControl fullWidth>
            <InputLabel>Тип аксессуара</InputLabel>
            <Select
              name="accessoryType"
              value={form.accessoryType}
              onChange={onChange}
              label="Тип аксессуара"
            >
              <MenuItem value="">—</MenuItem>
              <MenuItem value="case-phone">Чехол телефон</MenuItem>
              <MenuItem value="case-glasses">Чехол очки</MenuItem>
              <MenuItem value="keychain">Брелок</MenuItem>
              <MenuItem value="headband">Повязка</MenuItem>
            </Select>
          </FormControl>
        )}
        <Typography variant="h6">Изображения товара</Typography>
        <Button
          variant="outlined"
          component="label"
        >
          Загрузить изображения
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            hidden
            onChange={e => {
              const files = Array.from(e.target.files).slice(0, 4);
              setForm(f => ({ ...f, images: files }));
            }}
          />
        </Button>
        {form.images && form.images.length > 0 && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            {form.images.map((file, index) => (
              <Box key={index} sx={{ position: 'relative' }}>
          <img
            src={URL.createObjectURL(file)}
            alt={`Preview ${index + 1}`}
            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 4 }}
          />
          <Button
            size="small"
            color="error"
            onClick={() => {
              setForm(f => ({
                ...f,
                images: f.images.filter((_, i) => i !== index),
              }));
            }}
            sx={{ position: 'absolute', top: 0, right: 0 }}
          >
            ✕
          </Button>
              </Box>
            ))}
          </Box>
        )}
        <Button type="submit" variant="contained" size="large">
          Сохранить
        </Button>
      </Box>
    </Box>
  )
}

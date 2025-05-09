// src/pages/admin/UserCreate.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function UserCreate() {
  const navigate = useNavigate(); // v6; для v5: const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsAdmin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, is_active: isActive }),
      });
      if (!res.ok) {
        const payload = await res.json();
        throw new Error(payload.message || 'Ошибка при создании');
      }
      // После успешного создания — возвращаемся в список
      navigate('/admin/users');
      // для v5: history.push('/admin/users');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={3} maxWidth={480} mx="auto">
      <Typography variant="h5" mb={2}>
        Добавить пользователя
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          fullWidth
          margin="normal"
        />

        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          fullWidth
          margin="normal"
        />

        <FormControlLabel
          control={
            <Switch
              checked={isActive}
              onChange={e => setIsAdmin(e.target.checked)}
            />
          }
          label="Администратор"
          sx={{ mt: 1, mb: 2 }}
        />

        <Box display="flex" justifyContent="flex-end" alignItems="center">
          {loading && <CircularProgress size={24} sx={{ mr: 2 }} />}
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
          >
            Создать
          </Button>
        </Box>
      </form>
    </Box>
  );
}

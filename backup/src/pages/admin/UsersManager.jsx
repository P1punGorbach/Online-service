// src/pages/admin/UsersManager.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  CircularProgress,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';

export default function UsersManager() {
  const [users, setUsers] = useState([
    {id: 1, email: 'alex@example.com', isAdmin: true},
    {id: 2, email: 'bundarahma@example.com', isAdmin: false},
    {id: 3, email: 'kek@example.com', isAdmin: false},
  ]);
  const [loading, setLoading] = useState(true);

  // Загрузка списка пользователей
  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
      })
      .catch(err => {
        console.error('Не удалось загрузить пользователей:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = (userId) => {
    if (!window.confirm('Удалить пользователя?')) return;
    fetch(`/api/users/${userId}`, { method: 'DELETE' })
      .then(res => {
        if (res.ok) {
          setUsers(u => u.filter(x => x.id !== userId));
        } else {
          alert('Ошибка при удалении');
        }
      })
      .catch(err => {
        console.error(err);
        alert('Ошибка при удалении');
      });
  };

  // Удаляем функционал редактирования, оставляем пустое место

  const handleAdd = () => {
    window.location.href = '/admin/users/new';
  };

  return (
    <Box p={3}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Управление пользователями</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Добавить пользователя
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Администратор</TableCell>
                <TableCell>Зарегистрирован</TableCell>
                <TableCell align="right">Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.is_admin ? 'Да' : 'Нет'}</TableCell>
                  <TableCell>
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(user.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {users.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Пользователи не найдены
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}

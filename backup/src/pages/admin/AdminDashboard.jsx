// src/pages/admin/AdminDashboard.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function AdminDashboard() {
  return (
    <Box
      sx={{
        p: 4,       
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',       // центрируем по горизонтали
        justifyContent: 'center',   // центрируем по вертикали (при необходимости)
        gap: 4,
      }}
    >
      <Typography variant="h4" component="h1" align="center">
        Панель администратора
      </Typography>

      <Paper elevation={3} sx={{ width: '100%', maxWidth: 360 }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/admin/users">
              <ListItemIcon>
                <PeopleIcon />
              </ListItemIcon>
              <ListItemText primary="Управление пользователями" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton component={RouterLink} to="/admin/products">
              <ListItemIcon>
                <ShoppingCartIcon />
              </ListItemIcon>
              <ListItemText primary="Управление товарами" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

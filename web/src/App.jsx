
import React, { useEffect, useState } from 'react';
import { Routes, Route, Link as RouterLink, useNavigate, Navigate } from 'react-router-dom';
import { api, getToken, clearToken } from './api';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import AddProduct from './pages/AddProduct';
import MyListings from './pages/MyListings';
import ProductDetail from './pages/ProductDetail';
import Dashboard from './pages/Dashboard';
import Cart from './pages/Cart';
import Purchases from './pages/Purchases';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Container, Fab, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Header({ user, onLogout }) {
  return (
    <AppBar position="static" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 700 }}>
          EcoFinds <Box component="span" sx={{ fontSize: 12, ml: 1, bgcolor: 'secondary.main', px: 1, borderRadius: 1 }}>MVP</Box>
        </Typography>
        {user ? (
          <>
            <Button color="inherit" component={RouterLink} to="/my">My Listings</Button>
            <Button color="inherit" component={RouterLink} to="/cart">Cart</Button>
            <Button color="inherit" component={RouterLink} to="/purchases">Purchases</Button>
            <Button color="inherit" component={RouterLink} to="/dashboard">{user.username || user.email}</Button>
            <Button color="secondary" variant="outlined" sx={{ ml: 2 }} onClick={onLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/signup">Sign up</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const nav = useNavigate();

  async function refreshMe() {
    try {
      if (getToken()) {
        const me = await api.me();
        setUser(me);
      } else setUser(null);
    } catch (e) {
      console.error(e);
      clearToken();
      setUser(null);
    }
  }

  useEffect(() => { refreshMe(); }, []);

  function requireAuth(children) {
    return getToken() ? children : <Navigate to="/login" />;
  }

  return (
    <>
      <Header user={user} onLogout={() => { clearToken(); setUser(null); nav('/'); }} />
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login onAuth={refreshMe} />} />
          <Route path="/signup" element={<Signup onAuth={refreshMe} />} />
          <Route path="/add" element={requireAuth(<AddProduct />)} />
          <Route path="/edit/:id" element={requireAuth(<AddProduct editMode />)} />
          <Route path="/my" element={requireAuth(<MyListings />)} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={requireAuth(<Dashboard onSaved={refreshMe} />)} />
          <Route path="/cart" element={requireAuth(<Cart />)} />
          <Route path="/purchases" element={requireAuth(<Purchases />)} />
        </Routes>
        <Tooltip title="Add a new product" placement="left">
          <Fab color="primary" aria-label="add" component={RouterLink} to="/add" sx={{ position: 'fixed', bottom: 32, right: 32 }}>
            <AddIcon />
          </Fab>
        </Tooltip>
      </Container>
      <Box sx={{ textAlign: 'center', py: 2, color: 'text.secondary' }}>
        <Typography variant="body2">© {new Date().getFullYear()} EcoFinds</Typography>
      </Box>
    </>
  );
}

export default App

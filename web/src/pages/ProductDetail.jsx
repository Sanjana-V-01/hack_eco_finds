
import React, { useEffect, useState } from 'react';
import { api, getToken } from '../api';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Button, Box, Chip } from '@mui/material';

export default function ProductDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const [p, setP] = useState(null)
  const [err, setErr] = useState('')

  useEffect(() => { api.product(id).then(setP).catch(e=>setErr(e.message)) }, [id])

  async function addToCart() {
    if (!getToken()) { nav('/login'); return; }
    await api.addToCart(p.id, 1); nav('/cart')
  }

  if (err) return <Typography color="error" sx={{ mt: 2 }}>{err}</Typography>;
  if (!p) return <Typography color="text.secondary" sx={{ mt: 2 }}>Loading...</Typography>;

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, p: 2 }}>
      <CardMedia component="img" height="260" image={p.image_url} alt={p.title} sx={{ objectFit: 'contain', bgcolor: '#fafafa' }} />
      <CardContent>
        <Typography variant="h5" gutterBottom>{p.title}</Typography>
        <Chip label={p.category} color="secondary" sx={{ mb: 2 }} />
        <Typography variant="body1" sx={{ mb: 2 }}>{p.description}</Typography>
        <Typography variant="h6" color="primary" sx={{ mb: 2 }}>₹{p.price}</Typography>
        <Button variant="contained" color="primary" onClick={addToCart} fullWidth>Add to cart</Button>
      </CardContent>
    </Card>
  );
}

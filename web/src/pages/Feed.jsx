
import React, { useEffect, useState } from 'react';
import { api } from '../api';
import { Link as RouterLink } from 'react-router-dom';
import { Grid, Card, CardMedia, CardContent, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl, Box } from '@mui/material';

export default function Feed() {
  const [items, setItems] = useState([])
  const [cats, setCats] = useState([])
  const [cat, setCat] = useState('')
  const [q, setQ] = useState('')

  async function load() {
    const [list, categories] = await Promise.all([api.list({ category: cat, q }), api.categories()])
    setItems(list); setCats(categories)
  }
  useEffect(() => { load() }, [cat])
  async function search(e) {
    e.preventDefault(); const list = await api.list({ category: cat, q }); setItems(list)
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={search} style={{ display: 'flex', gap: 2, flex: 1 }}>
          <TextField label="Search by title" variant="outlined" value={q} onChange={e=>setQ(e.target.value)} size="small" sx={{ flex: 1 }} />
          <Button type="submit" variant="contained" color="primary">Search</Button>
        </form>
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel>Category</InputLabel>
          <Select value={cat} label="Category" onChange={e=>setCat(e.target.value)}>
            <MenuItem value="">All Categories</MenuItem>
            {cats.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={3}>
        {items.map(p => (
          <Grid item xs={12} sm={6} md={4} key={p.id}>
            <Card component={RouterLink} to={`/product/${p.id}`} sx={{ textDecoration: 'none', height: '100%' }}>
              <CardMedia component="img" height="180" image={p.image_url} alt={p.title} />
              <CardContent>
                <Typography variant="h6" gutterBottom>{p.title}</Typography>
                <Typography variant="body2" color="text.secondary">₹{p.price}</Typography>
                <Box sx={{ mt: 1, display: 'inline-block', bgcolor: 'secondary.light', px: 1, borderRadius: 1, fontSize: 12 }}>{p.category}</Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

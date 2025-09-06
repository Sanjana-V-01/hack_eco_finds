
import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { Link, useNavigate } from 'react-router-dom'

export default function MyListings() {
  const [items, setItems] = useState([])
  const nav = useNavigate()
  async function load() { setItems(await api.myListings()) }
  useEffect(() => { load() }, [])

  async function del(id) {
    if (!confirm('Delete this product?')) return;
    await api.deleteProduct(id); load();
  }

  return (
    <div>
      <div className="row" style={{ justifyContent:'space-between', marginBottom: '.5rem' }}>
        <h2>My Listings</h2>
        <button className="btn" onClick={()=>nav('/add')}>+ Add</button>
      </div>
      <div className="grid">
        {items.map(p => (
          <div key={p.id} className="card">
            <img src={p.image_url} alt={p.title} />
            <div style={{ marginTop: '.5rem' }}>
              <div style={{ fontWeight: 600 }}>{p.title}</div>
              <div className="muted">₹{p.price}</div>
              <div className="row">
                <button className="btn secondary" onClick={()=>nav('/edit/'+p.id)}>Edit</button>
                <button className="btn" onClick={()=>del(p.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

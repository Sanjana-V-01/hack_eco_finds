
import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { useNavigate } from 'react-router-dom'

export default function Cart() {
  const [items, setItems] = useState([])
  const nav = useNavigate()

  async function load() { const c = await api.cart(); setItems(c.items) }
  useEffect(() => { load() }, [])

  const total = items.reduce((s, it) => s + (it.price * it.qty), 0)

  async function remove(id) { await api.removeFromCart(id); load(); }
  async function checkout() { await api.checkout(); nav('/purchases') }

  return (
    <div>
      <h2>Cart</h2>
      <div className="grid">
        {items.map(it => (
          <div key={it.product_id} className="card">
            <img src={it.image_url} alt={it.title} />
            <div style={{ fontWeight: 600 }}>{it.title}</div>
            <div className="muted">Qty: {it.qty}</div>
            <div>₹{it.price}</div>
            <button className="btn" onClick={()=>remove(it.product_id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop: '1rem' }}>
        <h3>Total: ₹{total.toFixed(2)}</h3>
        <button className="btn" onClick={checkout} disabled={!items.length}>Checkout</button>
      </div>
    </div>
  )
}

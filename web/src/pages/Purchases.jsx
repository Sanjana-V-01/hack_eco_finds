
import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Purchases() {
  const [orders, setOrders] = useState([])
  useEffect(() => { api.orders().then(setOrders) }, [])

  return (
    <div>
      <h2>Previous Purchases</h2>
      {!orders.length && <div className="muted">No purchases yet.</div>}
      <div className="row" style={{ flexDirection: 'column', gap: '1rem' }}>
        {orders.map(o => (
          <div key={o.id} className="card">
            <div className="muted">Order #{o.id} • {new Date(o.created_at).toLocaleString()}</div>
            <div className="grid">
              {o.items.map(it => (
                <div key={it.product_id} className="card">
                  <img src={it.image_url || 'https://via.placeholder.com/600x400?text=EcoFinds'} alt={it.title} />
                  <div style={{ fontWeight: 600 }}>{it.title}</div>
                  <div className="muted">Qty: {it.qty}</div>
                  <div>₹{it.price}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

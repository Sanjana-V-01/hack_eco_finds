
import React, { useEffect, useState } from 'react'
import { api } from '../api'
import { useNavigate, useParams } from 'react-router-dom'

export default function AddProduct({ editMode }) {
  const nav = useNavigate()
  const { id } = useParams()
  const [cats, setCats] = useState([])
  const [form, setForm] = useState({ title:'', category:'', description:'', price:'', image_url:'' })
  const [err, setErr] = useState('')

  useEffect(() => { api.categories().then(setCats) }, [])
  useEffect(() => {
    if (editMode && id) api.product(id).then(p => setForm({ ...p, price: p.price.toString() }))
  }, [editMode, id])

  function set(k, v) { setForm(s => ({ ...s, [k]: v })) }

  async function submit(e) {
    e.preventDefault(); setErr('')
    try {
      const payload = { ...form, price: parseFloat(form.price) }
      if (editMode) await api.updateProduct(id, payload)
      else await api.createProduct(payload)
      nav('/my')
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="container" style={{ maxWidth: 640 }}>
      <div className="card">
        <h2>{editMode ? 'Edit Product' : 'Add New Product'}</h2>
        <form className="row" onSubmit={submit}>
          <input className="input" placeholder="Product Title" value={form.title} onChange={e=>set('title', e.target.value)} />
          <select className="input" value={form.category} onChange={e=>set('category', e.target.value)}>
            <option value="">Select Category</option>
            {cats.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea className="input" rows="4" placeholder="Description" value={form.description} onChange={e=>set('description', e.target.value)} />
          <input className="input" type="number" step="0.01" placeholder="Price" value={form.price} onChange={e=>set('price', e.target.value)} />
          <input className="input" placeholder="Image URL (placeholder allowed)" value={form.image_url} onChange={e=>set('image_url', e.target.value)} />
          {err && <div className="muted">{err}</div>}
          <button className="btn">{editMode ? 'Save Changes' : 'Submit Listing'}</button>
        </form>
      </div>
    </div>
  )
}

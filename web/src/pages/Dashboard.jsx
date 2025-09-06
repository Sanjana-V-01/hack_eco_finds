
import React, { useEffect, useState } from 'react'
import { api } from '../api'

export default function Dashboard({ onSaved }) {
  const [me, setMe] = useState(null)
  const [username, setUsername] = useState('')
  const [msg, setMsg] = useState('')

  useEffect(() => { api.me().then(u => { setMe(u); setUsername(u.username||'') }) }, [])

  async function save() {
    await api.updateMe(username)
    setMsg('Saved!'); onSaved?.()
    setTimeout(()=>setMsg(''), 1500)
  }

  if (!me) return <div className="muted">Loading...</div>
  return (
    <div className="card" style={{ maxWidth: 520 }}>
      <h2>User Dashboard</h2>
      <div className="row"><strong>Email</strong><span>{me.email}</span></div>
      <div style={{ marginTop: '.5rem' }}>
        <label>Username</label>
        <input className="input" value={username} onChange={e=>setUsername(e.target.value)} />
      </div>
      <button className="btn" onClick={save}>Save</button>
      {msg && <div className="muted">{msg}</div>}
    </div>
  )
}

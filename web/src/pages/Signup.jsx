
import React, { useState } from 'react'
import { api, setToken } from '../api'
import { Link, useNavigate } from 'react-router-dom'

export default function Signup({ onAuth }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    setErr('')
    try {
      const { token } = await api.register(email, password, username)
      setToken(token)
      onAuth?.()
      nav('/')
    } catch (e) { setErr(e.message) }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card">
        <h2>Sign up</h2>
        <form onSubmit={submit} className="row" style={{ alignItems: 'stretch' }}>
          <input className="input" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className="input" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <input className="input" placeholder="Username (optional)" value={username} onChange={e=>setUsername(e.target.value)} />
          {err && <div className="muted">{err}</div>}
          <button className="btn" type="submit">Create account</button>
        </form>
        <p className="muted">Have an account? <Link className="link" to="/login">Log in</Link></p>
      </div>
    </div>
  )
}

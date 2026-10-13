import { useState } from 'react'
import { ErrorBox, useAction } from './ui.jsx'

/** HU-01: log in with username and password. */
export function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { error, busy, run } = useAction()

  return (
    <div className="login">
      <form className="panel" onSubmit={(e) => { e.preventDefault(); run(() => onLogin(username, password)) }}>
        <h1>Manager Library</h1>
        <p className="muted">Ingrese con su usuario de la biblioteca.</p>
        <label>Usuario<input autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
        <label>Contraseña<input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <button className="primary" disabled={busy}>{busy ? 'Ingresando…' : 'Ingresar'}</button>
        <ErrorBox error={error} />
      </form>
    </div>
  )
}

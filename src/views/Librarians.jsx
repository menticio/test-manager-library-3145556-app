import { useState } from 'react'
import { api } from '../api.js'
import { ErrorBox, Notice, useAction } from './ui.jsx'

/** HU-02 (admin): create a librarian. The role is always librarian; the password is never shown back. */
export function Librarians() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { error, notice, busy, run } = useAction()

  return (
    <section>
      <h2>Bibliotecarios</h2>
      <form className="panel" onSubmit={(e) => {
        e.preventDefault()
        run(async () => { const user = await api.createLibrarian(username, password); setUsername(''); setPassword(''); return user }, 'Bibliotecario creado.')
      }}>
        <h3>Nuevo bibliotecario</h3>
        <div className="grid">
          <label>Usuario<input value={username} onChange={(e) => setUsername(e.target.value)} required /></label>
          <label>Contraseña<input type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        </div>
        <button className="primary" disabled={busy}>Crear</button>
        <ErrorBox error={error} /><Notice text={notice} />
      </form>
    </section>
  )
}

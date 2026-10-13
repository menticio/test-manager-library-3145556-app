import { useEffect, useState } from 'react'
import { api, session } from './api.js'
import { Login } from './views/Login.jsx'
import { Catalog } from './views/Catalog.jsx'
import { Members } from './views/Members.jsx'
import { Lend } from './views/Lend.jsx'
import { Loans } from './views/Loans.jsx'
import { Overdue } from './views/Overdue.jsx'
import { Report } from './views/Report.jsx'
import { Librarians } from './views/Librarians.jsx'

const VIEWS = [
  { id: 'catalog', label: 'Catálogo', roles: ['admin', 'librarian'], View: Catalog },
  { id: 'members', label: 'Socios', roles: ['admin', 'librarian'], View: Members },
  { id: 'lend', label: 'Prestar', roles: ['admin', 'librarian'], View: Lend },
  { id: 'loans', label: 'Préstamos y devoluciones', roles: ['admin', 'librarian'], View: Loans },
  { id: 'overdue', label: 'Vencidos', roles: ['admin', 'librarian'], View: Overdue },
  { id: 'report', label: 'Más prestados', roles: ['admin'], View: Report },
  { id: 'librarians', label: 'Bibliotecarios', roles: ['admin'], View: Librarians },
]

export default function App() {
  const [role, setRole] = useState(session.role)
  const [current, setCurrent] = useState('catalog')

  useEffect(() => {
    const expired = () => setRole(null)
    window.addEventListener('session-expired', expired)
    return () => window.removeEventListener('session-expired', expired)
  }, [])

  if (!role) {
    return <Login onLogin={async (username, password) => {
      const result = await api.login(username, password)
      session.save(result.access_token, result.role)
      setRole(result.role)
    }} />
  }

  const views = VIEWS.filter((v) => v.roles.includes(role))
  const { View } = views.find((v) => v.id === current) ?? views[0]

  return (
    <div className="shell">
      <header className="topbar">
        <strong>Manager Library</strong>
        <nav>
          {views.map((v) => (
            <button key={v.id} className={v.id === current ? 'tab active' : 'tab'} onClick={() => setCurrent(v.id)}>{v.label}</button>
          ))}
        </nav>
        <span className="who">{role === 'admin' ? 'Administrador' : 'Bibliotecario'}</span>
        <button className="ghost" onClick={() => { session.clear(); setRole(null) }}>Salir</button>
      </header>
      <main className="content"><View role={role} /></main>
    </div>
  )
}

import { useState } from 'react'
import { api } from '../api.js'
import { ErrorBox, useAction } from './ui.jsx'

const today = new Date().toISOString().slice(0, 10)
const monthStart = `${today.slice(0, 8)}01`

/** HU-10 (admin): most borrowed books in a range, with the frozen title and category. No members. */
export function Report() {
  const [from, setFrom] = useState(monthStart)
  const [to, setTo] = useState(today)
  const [report, setReport] = useState(null)
  const { error, busy, run } = useAction()

  return (
    <section>
      <h2>Libros más prestados</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); run(async () => setReport(await api.mostBorrowed(from, to))) }}>
        <label className="inline">Desde<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} required /></label>
        <label className="inline">Hasta<input type="date" value={to} onChange={(e) => setTo(e.target.value)} required /></label>
        <button disabled={busy}>Ver reporte</button>
      </form>
      <ErrorBox error={error} />
      {report && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>#</th><th>Libro</th><th>Categoría</th><th>Veces prestado</th></tr></thead>
            <tbody>
              {report.rows.map((r, i) => <tr key={`${r.book_id}-${r.book_title}-${r.category_name}`}><td>{i + 1}</td><td>{r.book_title}</td><td>{r.category_name}</td><td><strong>{r.times_borrowed}</strong></td></tr>)}
              {report.rows.length === 0 && <tr><td colSpan={4} className="muted">No hubo préstamos en ese rango.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

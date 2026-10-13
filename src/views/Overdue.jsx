import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { ErrorBox, formatDate, useAction } from './ui.jsx'

/** HU-09: lines not returned past their due date, most days late first (computed by the API). */
export function Overdue() {
  const [items, setItems] = useState(null)
  const { error, run } = useAction()
  useEffect(() => { run(async () => setItems((await api.overdue()).items)) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section>
      <h2>Libros vencidos</h2>
      <ErrorBox error={error} />
      {items && (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Libro</th><th>Socio</th><th>Vencía</th><th>Días de retraso</th></tr></thead>
            <tbody>
              {items.map((i) => <tr key={i.item_id}><td>{i.book_title}</td><td>{i.member_name}</td><td>{formatDate(i.due_at)}</td><td><strong>{i.days_late}</strong></td></tr>)}
              {items.length === 0 && <tr><td colSpan={4} className="muted">No hay libros vencidos.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { ErrorBox, Notice, Pager, STATUS, formatDate, useAction } from './ui.jsx'

/** HU-07 and HU-08: list loans by date and status (computed by the API) and return one line at a time. */
export function Loans() {
  const [filters, setFilters] = useState({ status: 'open', from: '', to: '' })
  const [result, setResult] = useState(null)
  const list = useAction()
  const back = useAction()

  const load = (page = 1, f = filters) => list.run(async () => setResult(await api.loans({ ...f, page, size: 10 })))
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section>
      <h2>Préstamos y devoluciones</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); load(1) }}>
        <select value={filters.status} onChange={(e) => { const f = { ...filters, status: e.target.value }; setFilters(f); load(1, f) }}>
          <option value="">Todos</option><option value="open">Abiertos</option><option value="overdue">Vencidos</option><option value="closed">Cerrados</option>
        </select>
        <label className="inline">Desde<input type="date" value={filters.from} onChange={(e) => setFilters({ ...filters, from: e.target.value })} /></label>
        <label className="inline">Hasta<input type="date" value={filters.to} onChange={(e) => setFilters({ ...filters, to: e.target.value })} /></label>
        <button>Filtrar</button>
      </form>
      <ErrorBox error={list.error} /><ErrorBox error={back.error} /><Notice text={back.notice} />

      {result && (
        <>
          {result.items.map((loan) => (
            <article key={loan.id} className="panel loan">
              <header><strong>{formatDate(loan.loaned_at)}</strong><span className={`badge ${loan.status}`}>{STATUS[loan.status]}</span></header>
              <ul>
                {loan.items.map((item) => (
                  <li key={item.id}>
                    <span>{item.book_title} · vence {formatDate(item.due_at)}</span>
                    {item.returned_at
                      ? <span className="muted">Devuelto {formatDate(item.returned_at)}</span>
                      : <button disabled={back.busy} onClick={() => back.run(async () => { await api.returnItem(loan.id, item.id); await load(result.page) }, 'Devolución registrada.')}>Devolver</button>}
                  </li>
                ))}
              </ul>
            </article>
          ))}
          {result.items.length === 0 && <p className="muted">No hay préstamos con ese filtro.</p>}
          <Pager page={result.page} size={result.size} total={result.total} onPage={load} />
        </>
      )}
    </section>
  )
}

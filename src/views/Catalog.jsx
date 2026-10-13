import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { ErrorBox, Notice, Pager, useAction } from './ui.jsx'

const EMPTY = { title: '', author: '', isbn: '', category_id: '', total_copies: 1 }

/** HU-03 and HU-04: search the catalog; the admin creates, edits the total and retires books. */
export function Catalog({ role }) {
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({ q: '', category_id: '', page: 1 })
  const [result, setResult] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const list = useAction()
  const edit = useAction()

  const load = (f = filters) => list.run(async () => setResult(await api.books({ ...f, size: 10 })))

  useEffect(() => { api.categories().then((r) => setCategories(r.items)).catch(() => {}); load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const search = (changes) => { const f = { ...filters, ...changes }; setFilters(f); load(f) }

  return (
    <section>
      <h2>Catálogo</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); search({ page: 1 }) }}>
        <input placeholder="Título o autor" value={filters.q} onChange={(e) => setFilters({ ...filters, q: e.target.value })} />
        <select value={filters.category_id} onChange={(e) => search({ category_id: e.target.value, page: 1 })}>
          <option value="">Todas las categorías</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button>Buscar</button>
      </form>
      <ErrorBox error={list.error} />

      {result && (
        <>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Título</th><th>Autor</th><th>ISBN</th><th>Categoría</th><th>Disponibles</th>{role === 'admin' && <th />}</tr></thead>
              <tbody>
                {result.items.map((b) => (
                  <tr key={b.id}>
                    <td>{b.title}</td><td>{b.author}</td><td className="mono">{b.isbn}</td><td>{b.category.name}</td>
                    <td>{b.available_copies} / {b.total_copies}</td>
                    {role === 'admin' && (
                      <td className="actions">
                        <button onClick={() => {
                          const total = Number(window.prompt(`Nuevo total de ejemplares de «${b.title}»`, b.total_copies))
                          if (total) edit.run(async () => { await api.updateBook(b.id, { title: b.title, author: b.author, category_id: b.category.id, total_copies: total }); await load() }, 'Total actualizado.')
                        }}>Total</button>
                        <button className="danger" onClick={() => window.confirm(`¿Dar de baja «${b.title}»?`)
                          && edit.run(async () => { await api.retireBook(b.id); await load() }, 'Libro dado de baja.')}>Dar de baja</button>
                      </td>
                    )}
                  </tr>
                ))}
                {result.items.length === 0 && <tr><td colSpan={6} className="muted">Sin resultados.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pager page={result.page} size={result.size} total={result.total} onPage={(page) => search({ page })} />
        </>
      )}

      {role === 'admin' && (
        <form className="panel" onSubmit={(e) => {
          e.preventDefault()
          edit.run(async () => { await api.createBook({ ...form, total_copies: Number(form.total_copies) }); setForm(EMPTY); await load() }, 'Libro creado.')
        }}>
          <h3>Nuevo libro</h3>
          <div className="grid">
            <label>Título<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></label>
            <label>Autor<input value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required /></label>
            <label>ISBN (13 dígitos)<input value={form.isbn} inputMode="numeric" onChange={(e) => setForm({ ...form, isbn: e.target.value })} required /></label>
            <label>Categoría
              <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} required>
                <option value="">Elija una</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <label>Ejemplares<input type="number" min="1" value={form.total_copies} onChange={(e) => setForm({ ...form, total_copies: e.target.value })} required /></label>
          </div>
          <button className="primary" disabled={edit.busy}>Crear libro</button>
        </form>
      )}
      <ErrorBox error={edit.error} /><Notice text={edit.notice} />
    </section>
  )
}

import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { ErrorBox, Notice, Pager, useAction } from './ui.jsx'

/** HU-05: list, search and create members (they are never deleted). */
export function Members() {
  const [q, setQ] = useState('')
  const [result, setResult] = useState(null)
  const [form, setForm] = useState({ full_name: '', document_number: '' })
  const list = useAction()
  const create = useAction()

  const load = (page = 1) => list.run(async () => setResult(await api.members({ q, page, size: 10 })))
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section>
      <h2>Socios</h2>
      <form className="row" onSubmit={(e) => { e.preventDefault(); load() }}>
        <input placeholder="Nombre o documento" value={q} onChange={(e) => setQ(e.target.value)} />
        <button>Buscar</button>
      </form>
      <ErrorBox error={list.error} />
      {result && (
        <>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Nombre</th><th>Documento</th></tr></thead>
              <tbody>
                {result.items.map((m) => <tr key={m.id}><td>{m.full_name}</td><td className="mono">{m.document_number}</td></tr>)}
                {result.items.length === 0 && <tr><td colSpan={2} className="muted">Sin resultados.</td></tr>}
              </tbody>
            </table>
          </div>
          <Pager page={result.page} size={result.size} total={result.total} onPage={load} />
        </>
      )}

      <form className="panel" onSubmit={(e) => {
        e.preventDefault()
        create.run(async () => { await api.createMember(form); setForm({ full_name: '', document_number: '' }); await load() }, 'Socio creado.')
      }}>
        <h3>Nuevo socio</h3>
        <div className="grid">
          <label>Nombre completo<input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required /></label>
          <label>Documento<input value={form.document_number} onChange={(e) => setForm({ ...form, document_number: e.target.value })} required /></label>
        </div>
        <button className="primary" disabled={create.busy}>Crear socio</button>
        <ErrorBox error={create.error} /><Notice text={create.notice} />
      </form>
    </section>
  )
}

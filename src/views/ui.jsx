import { useState } from 'react'

/** Shows the message of the contract error body (in Spanish, from the API). */
export function ErrorBox({ error }) {
  if (!error) return null
  return <p className="error" role="alert">{error.message}{error.details?.length ? ` (${error.details.map((d) => d.field).join(', ')})` : ''}</p>
}

export function Notice({ text }) {
  return text ? <p className="notice" role="status">{text}</p> : null
}

/** Runs an async action keeping its error and a success notice. */
export function useAction() {
  const [error, setError] = useState(null)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const run = async (fn, okText = '') => {
    setBusy(true); setError(null); setNotice('')
    try {
      const result = await fn()
      setNotice(okText)
      return result
    } catch (e) {
      setError(e)
      return undefined
    } finally {
      setBusy(false)
    }
  }
  return { error, notice, busy, run }
}

export function Pager({ page, size, total, onPage }) {
  const pages = Math.max(1, Math.ceil(total / size))
  return (
    <div className="pager">
      <button disabled={page <= 1} onClick={() => onPage(page - 1)}>Anterior</button>
      <span>Página {page} de {pages} · {total} resultados</span>
      <button disabled={page >= pages} onClick={() => onPage(page + 1)}>Siguiente</button>
    </div>
  )
}

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC' : '—')

export const STATUS = { open: 'Abierto', overdue: 'Vencido', closed: 'Cerrado' }

import { useState } from 'react'
import { api } from '../api.js'
import { ErrorBox, Notice, formatDate, useAction } from './ui.jsx'

/** HU-06: one member, 1 to 3 books. The rules (limit, overdue, copies) are enforced by the API; its message is shown as is. */
export function Lend() {
  const [memberQuery, setMemberQuery] = useState('')
  const [members, setMembers] = useState([])
  const [member, setMember] = useState(null)
  const [bookQuery, setBookQuery] = useState('')
  const [books, setBooks] = useState([])
  const [chosen, setChosen] = useState([])
  const [loan, setLoan] = useState(null)
  const action = useAction()

  const toggle = (book) => setChosen((list) => list.some((b) => b.id === book.id)
    ? list.filter((b) => b.id !== book.id)
    : list.length < 3 ? [...list, book] : list)

  return (
    <section>
      <h2>Registrar un préstamo</h2>
      <div className="two-col">
        <div className="panel">
          <h3>1. Socio</h3>
          <form className="row" onSubmit={(e) => { e.preventDefault(); action.run(async () => setMembers((await api.members({ q: memberQuery, size: 10 })).items)) }}>
            <input placeholder="Nombre o documento" value={memberQuery} onChange={(e) => setMemberQuery(e.target.value)} />
            <button>Buscar</button>
          </form>
          <ul className="pick">
            {members.map((m) => (
              <li key={m.id}><button className={member?.id === m.id ? 'chosen' : ''} onClick={() => setMember(m)}>{m.full_name} · {m.document_number}</button></li>
            ))}
          </ul>
        </div>
        <div className="panel">
          <h3>2. Libros (máximo 3)</h3>
          <form className="row" onSubmit={(e) => { e.preventDefault(); action.run(async () => setBooks((await api.books({ q: bookQuery, size: 10 })).items)) }}>
            <input placeholder="Título o autor" value={bookQuery} onChange={(e) => setBookQuery(e.target.value)} />
            <button>Buscar</button>
          </form>
          <ul className="pick">
            {books.map((b) => (
              <li key={b.id}><button className={chosen.some((c) => c.id === b.id) ? 'chosen' : ''} onClick={() => toggle(b)}>
                {b.title} · {b.available_copies} disponibles</button></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="panel">
        <p><strong>Socio:</strong> {member ? member.full_name : '—'} · <strong>Libros:</strong> {chosen.map((b) => b.title).join(', ') || '—'}</p>
        <button className="primary" disabled={!member || chosen.length === 0 || action.busy} onClick={() => action.run(async () => {
          setLoan(await api.lend(member.id, chosen.map((b) => b.id)))
          setChosen([])
        }, 'Préstamo registrado.')}>Registrar préstamo</button>
        <ErrorBox error={action.error} /><Notice text={action.notice} />
        {loan && (
          <ul>{loan.items.map((i) => <li key={i.id}>{i.book_title} — vence {formatDate(i.due_at)}</li>)}</ul>
        )}
      </div>
    </section>
  )
}

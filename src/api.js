// Client of api-contract.md. Base URL from VITE_API_URL (no secrets in the frontend).
const BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api/v1'

const session = {
  get token() { return sessionStorage.getItem('token') },
  get role() { return sessionStorage.getItem('role') },
  save(token, role) { sessionStorage.setItem('token', token); sessionStorage.setItem('role', role) },
  clear() { sessionStorage.removeItem('token'); sessionStorage.removeItem('role') },
}

export { session }

/** Error with the single body of the contract: { code, message, details }. */
export class ApiError extends Error {
  constructor(status, body) {
    super(body?.message ?? 'No se pudo completar la operación.')
    this.status = status
    this.code = body?.code
    this.details = body?.details ?? []
  }
}

async function request(method, path, body) {
  const headers = { Accept: 'application/json' }
  if (session.token) headers.Authorization = `Bearer ${session.token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  const response = await fetch(`${BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) })
  if (response.status === 204) return null
  const data = await response.json().catch(() => null)
  if (!response.ok) {
    if (response.status === 401 && path !== '/auth/login') {
      session.clear()
      window.dispatchEvent(new Event('session-expired'))
    }
    throw new ApiError(response.status, data)
  }
  return data
}

const query = (params) => {
  const q = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined))
  return q.toString() ? `?${q}` : ''
}

export const api = {
  login: (username, password) => request('POST', '/auth/login', { username, password }),
  createLibrarian: (username, password) => request('POST', '/users', { username, password, role: 'librarian' }),
  categories: () => request('GET', '/categories'),
  books: (params) => request('GET', `/books${query(params)}`),
  createBook: (book) => request('POST', '/books', book),
  updateBook: (id, book) => request('PUT', `/books/${id}`, book),
  retireBook: (id) => request('DELETE', `/books/${id}`),
  members: (params) => request('GET', `/members${query(params)}`),
  createMember: (member) => request('POST', '/members', member),
  lend: (memberId, bookIds) => request('POST', '/loans', { member_id: memberId, items: bookIds.map((id) => ({ book_id: id })) }),
  loans: (params) => request('GET', `/loans${query(params)}`),
  returnItem: (loanId, itemId) => request('POST', `/loans/${loanId}/items/${itemId}/return`),
  overdue: () => request('GET', '/loans/overdue'),
  mostBorrowed: (from, to) => request('GET', `/reports/most-borrowed${query({ from, to })}`),
}

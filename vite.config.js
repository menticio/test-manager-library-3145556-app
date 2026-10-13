import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Port 5173 matches CORS_ORIGIN of the API (plan.md §2).
export default defineConfig({
  plugins: [react()],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 5173 },
})

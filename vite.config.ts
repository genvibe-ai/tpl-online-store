import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Listen on all interfaces and accept proxied hosts so sandbox previews can reach the server.
  server: { host: true, allowedHosts: true },
  preview: { host: true, allowedHosts: true },
})

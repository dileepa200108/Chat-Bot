import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(),],
  server: {
    proxy: {
      "/message": "https://backend-test-production-ed922.up.railway.app",  // Proxy requests to the backend API endpoint
    },
  },
})

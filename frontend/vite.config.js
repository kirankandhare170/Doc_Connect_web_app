import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://doc-connect-5g3k.onrender.com', // backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

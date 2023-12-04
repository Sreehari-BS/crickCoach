import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6996,
    proxy: {
      "/api": {
        target: "http://localhost:7000",
        changeOrigin: true
      }
    }
  }
})

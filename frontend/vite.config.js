import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 6996,
    proxy: {
      "/api": {
        target: "https://crick-coach-azure-app.azurewebsites.net",
        changeOrigin: true
      }
    }
  }
})

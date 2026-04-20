import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This tells GitHub Pages where to find your files
  base: '/wedding-invitation/', 
  
  // Your existing plugins and server settings
  plugins: [react()],
  server: {
    host: true
  }
})
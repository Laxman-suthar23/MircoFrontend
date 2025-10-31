import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'host-app',
      remotes: {
        chatApp: 'https://mirco-frontend.vercel.app/assets/remoteEntry.js',
        emailApp: 'https://mirco-frontend-7yg5.vercel.app/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom']
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
  server: {
    port: 3000
  }
})
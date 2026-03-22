import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: '',
        configure: (proxy) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('[Vite proxy]', err.message)
          })
          proxy.on('proxyRes', (proxyRes, req) => {
            const status = proxyRes.statusCode
            console.log(`[Vite proxy] ${req.method} ${req.url} -> ${status}`)
          })
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})

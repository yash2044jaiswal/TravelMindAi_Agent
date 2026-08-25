import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            return
          }

          // React libraries
          if (
            id.includes('/react/') ||
            id.includes('/react-dom/') ||
            id.includes('/react-router-dom/')
          ) {
            return 'vendor'
          }

          // UI libraries
          if (
            id.includes('/framer-motion/') ||
            id.includes('/react-hot-toast/') ||
            id.includes('/react-icons/')
          ) {
            return 'ui'
          }

          // Chart libraries
          if (
            id.includes('/recharts/') ||
            id.includes('/react-google-charts/')
          ) {
            return 'charts'
          }

          // Other node_modules packages
          return 'vendor'
        },
      },
    },
  },
})

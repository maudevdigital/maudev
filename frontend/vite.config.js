import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Lo que comparten frontend y backend (oferta, permisos, estados).
      '@shared': path.resolve(__dirname, '../shared'),
    },
  },
  server: {
    // shared/ está fuera de frontend/: sin esto Vite se niega a servirlo en desarrollo.
    fs: { allow: [__dirname, path.resolve(__dirname, '../shared')] },
    // La API corre aparte (backend/, `npm run dev` en 8787). En producción es el
    // mismo dominio: maudev.cl/api/* lo atiende el Worker.
    proxy: { '/api': 'http://127.0.0.1:8787' },
  },
  build: {
    // Target moderno → menos "JavaScript antiguo"/polyfills (mejor TBT).
    target: 'es2020',
    rollupOptions: {
      output: {
        // Vendors pesados en chunks cacheables aparte del código de la app.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // Nombre estable y explícito para el runtime compartido de React.
          if (id.includes('/react-router') || id.includes('/react-dom') || id.includes('/react/') || id.includes('/scheduler/')) return 'react-runtime';
          if (id.includes('/moment')) return 'moment';
        },
      },
    },
  },
})

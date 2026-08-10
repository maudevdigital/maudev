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
    },
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

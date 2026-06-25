import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    modulePreload: {
      resolveDependencies: (filename, deps, { hostId, hostType }) => {
        // Prevent preloading admin chunks on public pages
        return deps.filter(dep => !dep.includes('admin'));
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) {
            if (id.includes('/src/pages/Admin/')) return 'admin';
            return undefined;
          }

          if (id.includes('bootstrap-icons') || id.includes('bootstrap/')) {
            return 'ui';
          }

          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('react-router-dom') ||
            id.includes('react-helmet-async')
          ) {
            return 'react-vendor';
          }

          return 'vendor';
        },
      },
    },
  },
})

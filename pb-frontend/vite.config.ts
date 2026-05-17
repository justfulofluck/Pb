import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const apiUrl = env.VITE_API_URL || 'http://localhost:8000';
  
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
        '/media': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },
    plugins: [react(), tailwindcss()],
    define: {

    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/framer-motion')) return 'vendor-framer';
            if (id.includes('node_modules/gsap')) return 'vendor-gsap';
            if (id.includes('node_modules/@tiptap')) return 'vendor-tiptap';
          }
        }
      }
    }
  };
});

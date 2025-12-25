import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import compression from 'vite-plugin-compression';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 4173,
        host: '0.0.0.0',
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          }
        }
      },
      preview: {
        port: 4173,
        host: '0.0.0.0',
      },
      plugins: [
        react(),
        vue(),
        compression({
          algorithm: 'gzip',
          ext: '.gz',
        }),
        compression({
          algorithm: 'brotliCompress',
          ext: '.br',
        })
      ],
      build: {
        target: 'esnext',
        minify: 'esbuild',
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('vue') || id.includes('pinia') || id.includes('vue-router')) {
                  return 'vendor-vue';
                }
                if (id.includes('react')) {
                  return 'vendor-react';
                }
                if (id.includes('lucide')) {
                  return 'vendor-icons';
                }
                if (id.includes('leaflet')) {
                  return 'vendor-maps';
                }
                return 'vendor';
              }
            },
          },
        },
        chunkSizeWarningLimit: 1000,
      },
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

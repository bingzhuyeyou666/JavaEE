import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/app/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@constants': path.resolve(__dirname, 'src/constants'),
      '@components': path.resolve(__dirname, 'src/components'),
    }
  },
  server: {
    port: 8080,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:8080',
      '/uploads': 'http://localhost:8080'
    }
  },
  preview: {
    port: 8080,
    strictPort: true
  },
  build: {
    outDir: '../src/main/resources/static/app',
    emptyOutDir: true
  }
});

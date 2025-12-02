import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: './src/pages',
  publicDir: '../../public',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/pages/index.html'),
        categories: resolve(__dirname, 'src/pages/categories.html'),
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@assets': resolve(__dirname, './src/assets'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages')
    }
  }
});

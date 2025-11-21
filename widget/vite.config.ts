import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget.tsx'),
      name: 'CourtneyWidget',
      fileName: (format) => `courtney-widget.${format}.js`,
      formats: ['umd'],
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) return 'courtney-widget.css';
          return assetInfo.name || 'asset';
        },
      },
    },
    cssCodeSplit: false,
  },
  define: {
    'process.env': {},
  },
})

import { defineConfig } from 'vite'
import reactSWC from '@vitejs/plugin-react-swc'
import {vanillaExtractPlugin} from '@vanilla-extract/vite-plugin'

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactSWC(), vanillaExtractPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react')) return 'react';
            if (id.includes('matter-js')) return 'matter-js';
            return 'vendor';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['matter-js']
  }
})

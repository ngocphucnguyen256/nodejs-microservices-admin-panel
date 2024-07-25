import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path';
import {configDefaults, coverageConfigDefaults } from 'vitest/config'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    exclude: [...configDefaults.exclude,'**/{postcss,tailwind}.config.cjs'],
    coverage: {
      exclude: [...coverageConfigDefaults.exclude, '**/{postcss,tailwind}.config.cjs']
    }
  }
})

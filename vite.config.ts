/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/task-timer/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setupTests.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/test-utils/',
        '**/*.test.{ts,tsx}',
        '**/*.spec.{ts,tsx}',
        'src/vite-env.d.ts',
        'src/main.tsx',
        'src/store.ts',
        'vite.config.ts',
        'eslint.config.js',
      ],
      // Realistic thresholds focused on business logic coverage
      // Currently at: 100% on business logic (slices, keyboard)
      // Lower overall due to presentation components being less critical to test
      thresholds: {
        branches: 80,
        functions: 70,
        lines: 45,
        statements: 45,
      },
    },
  },
});

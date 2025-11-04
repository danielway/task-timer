/// <reference types="vitest" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  base: '/task-timer/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
});

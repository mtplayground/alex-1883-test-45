import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const basePath = env.VITE_BASE_PATH?.trim() || '/';

  return {
    base: basePath,
    plugins: [react()],
    test: {
      exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**'],
    },
    server: {
      host: '0.0.0.0',
      port: 8080,
    },
    preview: {
      host: '0.0.0.0',
      port: 8080,
    },
  };
});

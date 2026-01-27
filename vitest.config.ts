import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['common/**/*.ts', 'plugin-src/**/*.ts'],
      exclude: ['**/*.test.ts', '**/node_modules/**']
    }
  },
  esbuild: {
    target: 'node18',
    format: 'esm'
  },
  resolve: {
    alias: {
      '@common': resolve(__dirname, './common'),
      '@plugin': resolve(__dirname, './plugin-src'),
      '@ui': resolve(__dirname, './ui-src')
    }
  }
});

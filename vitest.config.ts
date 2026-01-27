import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts']
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

import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react-swc';
import * as process from 'node:process';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: './ui-src',
  plugins: [
    svgr(),
    react(),
    viteSingleFile({ removeViteModuleLoader: true }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: 'runroom',
      project: 'penpot-exporter'
    })
  ],
  resolve: {
    alias: {
      'react': 'preact/compat',
      'react-dom': 'preact/compat',
      '!../css/base.css': '../css/base.css'
    }
  },
  build: {
    emptyOutDir: false,
    target: 'esnext',
    reportCompressedSize: false,
    outDir: '../dist',

    rollupOptions: {
      external: ['!../css/base.css']
    },

    sourcemap: true
  },
  define: {
    APP_VERSION: JSON.stringify(process.env.npm_package_version)
  }
});

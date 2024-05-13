import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: './ui-src',
  plugins: [svgr(), react(), viteSingleFile({ removeViteModuleLoader: true }), tsconfigPaths()],
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
    outDir: '../dist'
  }
});

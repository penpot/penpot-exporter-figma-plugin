import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  root: './ui-src',
  plugins: [svgr(), react(), viteSingleFile(), tsconfigPaths()],
  build: {
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000000,
    cssCodeSplit: false,
    outDir: '../dist',
    rollupOptions: {
      output: {
        inlineDynamicImports: true
      }
    }
  }
});

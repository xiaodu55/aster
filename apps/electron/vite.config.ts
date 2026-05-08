import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootPkg = resolve(__dirname, '../..');

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: resolve(__dirname, 'src/renderer'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@aster/ui': resolve(rootPkg, 'packages/ui/src'),
      '@aster/core': resolve(rootPkg, 'packages/core/src'),
      '@aster/shared': resolve(rootPkg, 'packages/shared/src'),
      '@aster/i18n': resolve(rootPkg, 'packages/i18n/src'),
      '@aster/longbridge-tools': resolve(rootPkg, 'packages/longbridge-tools/src'),
      '@aster/pi-extension': resolve(rootPkg, 'packages/pi-extension/src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  // Disable dependency optimization to work around bun rolldown issue
  optimizeDeps: {
    exclude: ['@aster/*'],
  },
});

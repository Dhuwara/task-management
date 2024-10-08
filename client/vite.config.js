import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    coverage: {
      provider: 'c8', // Use c8 as the coverage provider
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.vue', 'src/**/*.js'], // Include source files for coverage
      exclude: ['node_modules', 'test'], // Exclude test files and node_modules
    },
    globals: true,
    environment: 'jsdom',
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      // Any request starting with /api is forwarded to backend
      '/api': 'http://localhost:5000',
    },
  },
});

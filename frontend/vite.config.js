import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Read backend URL from environment or default to localhost for manual host running
const backendTarget = process.env.VITE_BACKEND_URL || 'http://localhost:5000';
console.log(`[Vite Config] Proxying /api to target: ${backendTarget}`);

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    watch: {
      usePolling: true
    },
    proxy: {
      '/api': {
        target: backendTarget,
        changeOrigin: true,
        secure: false,
      }
    }
  }
});

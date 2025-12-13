import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false
  },
  define: {
    'process.env.API_KEY': JSON.stringify("AIzaSyA12bcBcr9r6bwmKNJkxC74jd4nNx85CVs"),
  },
});
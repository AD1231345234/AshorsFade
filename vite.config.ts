import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  // Use relative base in production so assets load correctly on GitHub Pages
  // (which may serve the site from a subpath). You can override with VITE_BASE_PATH.
  const basePath = env.VITE_BASE_PATH || (mode === 'production' ? './' : '/');
  return {
    base: basePath,
    plugins: [react(), tailwindcss()],
    define: {
      ...(env.GEMINI_API_KEY && { 'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) }),
      ...(env.VITE_FIREBASE_API_KEY && { 'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY) }),
      ...(env.VITE_FIREBASE_AUTH_DOMAIN && { 'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(env.VITE_FIREBASE_AUTH_DOMAIN) }),
      ...(env.VITE_FIREBASE_PROJECT_ID && { 'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(env.VITE_FIREBASE_PROJECT_ID) }),
      ...(env.VITE_FIREBASE_STORAGE_BUCKET && { 'import.meta.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(env.VITE_FIREBASE_STORAGE_BUCKET) }),
      ...(env.VITE_FIREBASE_MESSAGING_SENDER_ID && { 'import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.VITE_FIREBASE_MESSAGING_SENDER_ID) }),
      ...(env.VITE_FIREBASE_APP_ID && { 'import.meta.env.VITE_FIREBASE_APP_ID': JSON.stringify(env.VITE_FIREBASE_APP_ID) }),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify — file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      allowedHosts: true,
      watch: {
        ignored: ['**/.local/**', '**/node_modules/**', '**/.git/**'],
      },
    },
  };
});

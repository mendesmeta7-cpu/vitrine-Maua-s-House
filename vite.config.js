import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Use root path for Vercel or Development
  // Use repo path ONLY for GitHub Pages production build (when not on Vercel)
  const isVercel = process.env.VERCEL;
  const base = mode === 'production' && !isVercel ? '/vitrine-Maua-s-House/' : '/';

  return {
    plugins: [react()],
    base: base,
  };
})

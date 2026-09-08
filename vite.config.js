import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Relative base so the built app works regardless of the GitHub Pages
  // repo name (served from https://<user>.github.io/<repo>/).
  base: './',
})

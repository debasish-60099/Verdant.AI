import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: '.', 
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['4173-ir2jmgw7fn8hiahg8l4bm-1413b090.manus.computer', '5173-ir2jmgw7fn8hiahg8l4bm-1413b090.manus.computer', 'all']
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    allowedHosts: ['4173-ir2jmgw7fn8hiahg8l4bm-1413b090.manus.computer', '5173-ir2jmgw7fn8hiahg8l4bm-1413b090.manus.computer', 'all']
  }
})


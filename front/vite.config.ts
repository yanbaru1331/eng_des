import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    modules: {
      scopeBehaviour: 'local', // デフォルトは local
    },
  },
  plugins: [react()],
  server: {

    port: 3001,
    host: "127.0.0.1",
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/tasks': {
        target: 'https://3mmwxjm08e.execute-api.us-east-2.amazonaws.com/tasks',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/tasks/, ''),
      },
      // You can add more proxy rules for different paths if needed
      // '/another-api': {
      //   target: 'https://another-backend.com',
      //   changeOrigin: true,
      //   secure: true,
      //   rewrite: (path) => path.replace(/^\/another-api/, ''),
      // },
    },
  },
})

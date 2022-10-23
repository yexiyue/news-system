import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      "~antd":"./node_modules/antd"
    }
  },
  server:{
    /* 配置反向代理 */
    proxy:{
      '/api':{
        target:'http://localhost:5143/',
        changeOrigin:false,
        rewrite(path) {
          return path.replace(/^\/api/g,'')
        },
      }
    }
  },
  /* define:{
    global:{}
  } */
})

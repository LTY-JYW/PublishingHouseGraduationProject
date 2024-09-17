import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


//el-plus
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// postCss
import postcss from 'postcss';
import pxToViewport from 'postcss-px-to-viewport';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  css: {
    postcss: {
      plugins: [
        postcss(),
        pxToViewport({
          // 设计稿的视口宽度
          viewportWidth: 1920,
          // landscape 视口宽度
          landscape: false,
          // 替换包含 px 的规则，而不是添加备用规则
          replace: true,

        }),
      ],
    },
  },
})

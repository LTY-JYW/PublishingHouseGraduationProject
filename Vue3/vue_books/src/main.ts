import { createApp } from 'vue'
import { createPinia } from 'pinia'
import  ElementPlus  from 'element-plus'
import 'element-plus/dist/index.css'
import  zhCn  from 'element-plus/es/locale/lang/zh-cn'
import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'swiper/css';

import App from './App.vue'
import router from './router'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

app.use(VueAwesomeSwiper)
app.use(createPinia())

app.use(router)
app.use(ElementPlus,{
    locale:zhCn
})

app.mount('#app')

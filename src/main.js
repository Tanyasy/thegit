import { createApp } from 'vue'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';
import App from './App.vue'
import store from './store'
import router from './router'
import './assets/css/global.css'

const app = createApp(App)
app.use(ElementPlus)

// vue3.0通过createApp方法创建一个vue对象，并返回，可以通过链式调用使用app对象
app.use(router).use(store).mount('#app')

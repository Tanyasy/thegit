import {createApp} from 'vue'//引入组件
import App from '../App.vue'
import SvgIcon from '@/components/SvgIcon.vue'// svg组件
//全局注册组件
createApp(App).component('svg-icon', SvgIcon)//此处递归获取.svg文件
const requireAll = requireContext => requireContext.keys().map(requireContext)
const req = require.context('./svg', false, /\.svg$/)

requireAll(req)
console.log("hello")
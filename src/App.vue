<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
// import * as echarts from 'echarts'
// import { provide } from 'vue'

export default {
  name: 'app',
  // components: {
  //   HelloWorld
  // }
  created() {
    // 在页面加载时，从sessionStorage读取状态信息
    if (sessionStorage.getItem("store")) {
      // Object.assign(a, b)相当于与a.update(b),也用于复制对象，主要用于合并对象
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem("store"))))
    }

    // 在页面刷新时将vuex的信息保存到sessionStorage里面
    window.addEventListener("beforeunload", () => {
      sessionStorage.setItem("store", JSON.stringify(this.$store.state))
    })
  },
  // setup() {
  //   provide('ec',echarts)
  // }
}
</script>

<style>

</style>

import { createStore } from 'vuex'

export default createStore({
  state: {
    isCollapse: false
  },
  mutations: {
    setCollapse(state) {
      state.isCollapse = !state.isCollapse
    }
  },
  actions: {
  },
  modules: {
  }
})

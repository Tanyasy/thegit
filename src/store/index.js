import { createStore } from 'vuex'

export default createStore({
  state: {
    isCollapse: false,
    userName: ""
  },
  mutations: {
    setCollapse(state) {
      state.isCollapse = !state.isCollapse
    },
    setUserName(state, tmp) {
      state.userName = tmp
    }
  },
  actions: {
  },
  modules: {
  }
})

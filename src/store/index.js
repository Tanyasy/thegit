import { createStore } from 'vuex'

export default createStore({
  state: {
    isCollapse: false,
    userName: "",
    tikTokName: "",
    tableData: []
  },
  mutations: {
    setCollapse(state) {
      state.isCollapse = !state.isCollapse
    },
    setUserName(state, tmp) {
      state.userName = tmp
    },
    settableData(state, tmp) {
      state.tableData = tmp
    },
    setTikTokName(state, tmp) {
      state.tikTokName = tmp
    }
  },
  actions: {
  },
  modules: {
  }
})

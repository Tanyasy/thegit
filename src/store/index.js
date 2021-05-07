import { createStore } from 'vuex'

export default createStore({
  state: {
    isCollapse: false,
    userName: "",
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
    }
  },
  actions: {
  },
  modules: {
  }
})

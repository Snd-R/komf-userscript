import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identifySeriesDialog: false,
  },
  mutations: {
    setIdentifySeriesDialog(state, dialog) {
      state.identifySeriesDialog = dialog
    },
  },
  actions: {
    dialogIdentifySeries({commit}) {
      commit('setIdentifySeriesDialog', true)
    },
    dialogIdentifySeriesDisplay({commit}, value) {
      commit('setIdentifySeriesDialog', value)
    },
  },
})

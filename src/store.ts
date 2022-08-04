import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identifySeriesDialog: false,
    identifySeriesDialogTitle: '',
  },
  mutations: {
    setIdentifySeriesDialog(state, dialog) {
      state.identifySeriesDialog = dialog
    },
    setIdentifySeriesDialogTitle(state, title) {
      state.identifySeriesDialogTitle = title
    },
  },
  actions: {
    dialogIdentifySeries({commit}, seriesTitle) {
      commit('setIdentifySeriesDialogTitle', seriesTitle)
      commit('setIdentifySeriesDialog', true)
    },
    dialogIdentifySeriesDisplay({commit}, value) {
      commit('setIdentifySeriesDialog', value)
    },
  },
})

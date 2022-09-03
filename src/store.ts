import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identifySeriesDialog: false,
    identifySeriesDialogTitle: '',
    resetSeriesDialog: false,
    resetSeries: '',
    resetLibraryDialog: false,
    resetLibrary: '',
  },
  mutations: {
    setIdentifySeriesDialog(state, dialog) {
      state.identifySeriesDialog = dialog
    },
    setIdentifySeriesDialogTitle(state, title) {
      state.identifySeriesDialogTitle = title
    },
    setResetSeriesDialog(state, dialog) {
      state.resetSeriesDialog = dialog
    },
    setResetSeries(state, seriesId) {
      state.resetSeries = seriesId
    },
    setResetLibraryDialog(state, dialog) {
      state.resetLibraryDialog = dialog
    },
    setResetLibrary(state, libraryId) {
      state.resetLibrary = libraryId
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
    dialogResetSeries({commit}, seriesId) {
      commit('setResetSeries', seriesId)
      commit('setResetSeriesDialog', true)
    },
    dialogResetSeriesDisplay({commit}, value) {
      commit('setResetSeriesDialog', value)
    },
    dialogResetLibrary({commit}, seriesId) {
      commit('setResetLibrary', seriesId)
      commit('setResetLibraryDialog', true)
    },
    dialogResetLibraryDisplay({commit}, value) {
      commit('setResetLibraryDialog', value)
    },
  },
})

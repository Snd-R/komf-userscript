<template>
  <div>

    <IdentifySeriesDialog
      v-model="identifySeriesDialog"
      :seriesTitle="identifySeriesDialogTitle"
    />

    <ConfirmationDialog
      v-model="resetSeriesDialog"
      title="Reset Series"
      body-html="All series metadata will be reset including field locks and thumbnails uploaded by Komf. No files will be modified. Continue?"
      confirm-text="Yes, reset series"
      button-confirm="Reset"
      button-confirm-color="error"
      @confirm="resetSeries"
    />

    <ConfirmationDialog
      v-model="resetLibraryDialog"
      title="Reset Library"
      body-html="All metadata of all series inside this library  will be reset including field locks and thumbnails uploaded by Komf. No files will be modified. Continue?"
      confirm-text="Yes, reset library"
      button-confirm="Reset"
      button-confirm-color="error"
      @confirm="resetLibrary"
    />
  </div>
</template>

<script lang="ts">
import IdentifySeriesDialog from '@/components/IdentifySeriesDialog.vue'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import Vue from 'vue'
import {ERROR, ErrorEvent} from '@/types/events'

export default Vue.extend({
  name: 'Dialogs',
  components: {
    ConfirmationDialog,
    IdentifySeriesDialog,
  },
  computed: {
    identifySeriesDialog: {
      get(): boolean {
        return this.$store.state.identifySeriesDialog
      },
      set(val) {
        this.$store.dispatch('dialogIdentifySeriesDisplay', val)
      },
    },
    identifySeriesDialogTitle(): string {
      return this.$store.state.identifySeriesDialogTitle
    },
    resetSeriesDialog: {
      get(): boolean {
        return this.$store.state.resetSeriesDialog
      },
      set(val) {
        this.$store.dispatch('dialogResetSeriesDisplay', val)
      },
    },

    seriesToReset(): string {
      return this.$store.state.resetSeries
    },
    resetLibraryDialog: {
      get(): boolean {
        return this.$store.state.resetLibraryDialog
      },
      set(val) {
        this.$store.dispatch('dialogResetLibraryDisplay', val)
      },
    },

    libraryToReset(): string {
      return this.$store.state.resetLibrary
    },
  },
  methods: {
    async resetSeries() {
      try {
        await this.$komfMetadata.resetSeries(this.seriesToReset)
      } catch (e) {
        this.$eventHub.$emit(ERROR, {message: e.message} as ErrorEvent)
      }
    },

    async resetLibrary() {
      try {
        await this.$komfMetadata.resetLibrary(this.libraryToReset)
      } catch (e) {
        this.$eventHub.$emit(ERROR, {message: e.message} as ErrorEvent)
      }
    },
  },
})
</script>

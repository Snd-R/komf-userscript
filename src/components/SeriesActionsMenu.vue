<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click.prevent="">
          <v-icon>mdi-book-edit</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item @click="promptIdentifySeries">
          <v-list-item-title>Identify</v-list-item-title>
        </v-list-item>
        <v-list-item @click="autoIdentify">
          <v-list-item-title>Auto-Identify</v-list-item-title>
        </v-list-item>
        <v-list-item @click="promptResetSeries">
          <v-list-item-title>Reset Metadata</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-dialog v-model="loading" :transition="false" fullscreen>
      <v-container fluid fill-height style="background-color: rgba(89,89,89,0.5);">
        <v-layout justify-center align-center>
          <v-progress-circular
            indeterminate
            color="primary">
          </v-progress-circular>
        </v-layout>
      </v-container>
    </v-dialog>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import {ERROR, ErrorEvent} from '@/types/events'

export default Vue.extend({
  name: 'SeriesActionsMenu',
  data: () => {
    return {
      loading: false,
    }
  },
  computed: {
    title(): string | undefined {
      return (document.querySelector('.v-main__wrap .v-toolbar__content .v-toolbar__title span') as HTMLElement).innerText
    },
    seriesId(): string {
      return window.location.pathname.split('/')[2]
    },
  },
  methods: {
    promptIdentifySeries() {
      this.$store.dispatch('dialogIdentifySeries', this.title)
    },

    promptResetSeries() {
      this.$store.dispatch('dialogResetSeries', this.seriesId)
    },
    async autoIdentify() {
      this.loading = true
      try {
        await this.$komfMetadata.matchSeries(this.seriesId)
      } catch (e) {
        this.$eventHub.$emit(ERROR, {message: e.message} as ErrorEvent)
      }
      this.loading = false
    },
  },
})
</script>

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
  methods: {
    promptIdentifySeries() {
      this.$store.dispatch('dialogIdentifySeries')
    },
    async autoIdentify() {
      const seriesId = window.location.pathname.split('/')[2]
      this.loading = true
      try {
        await this.$komfMetadata.matchSeries(seriesId)
      } catch (e) {
        this.$eventHub.$emit(ERROR, {message: e.message} as ErrorEvent)
      }
      this.loading = false
    },
  },
})
</script>

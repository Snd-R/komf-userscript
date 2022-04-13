<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    bottom
    app
    :vertical="snackbar.vertical"
    :timeout="snackbar.timeout"
  >
    <p>{{ snackbar.text }}</p>
    <p>{{ snackbar.text2 }}</p>
    <template v-slot:action="{ attrs }">
      <v-btn
        v-if="snackbar.goTo"
        color="secondary"
        text
        v-bind="attrs"
        @click="snackbar.goTo.click(); close()"
      >
        {{ snackbar.goTo.text }}
      </v-btn>

      <v-btn
        text
        v-bind="attrs"
        @click="close"
      >dismiss
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import Vue from 'vue'
import {ERROR, ErrorEvent} from '@/types/events'

export default Vue.extend({
  name: 'ToasterNotification',
  data: function () {
    return {
      queue: [] as any[],
      snackbar: {
        show: false,
        vertical: false,
        text: '',
        text2: '',
        color: undefined,
        timeout: 5000,
        goTo: {
          text: '',
          click: () => {
          },
        },
      },
    }
  },
  created() {
    this.$eventHub.$on(ERROR, this.onError)
  },
  beforeDestroy() {
    this.$eventHub.$off(ERROR, this.onError)
  },
  watch: {
    'snackbar.show'(val) {
      if (!val) {
        setTimeout(() => this.next(), 1000)
      }
    },
    queue(val) {
      if (val.length > 0) {
        this.next()
      }
    },
  },
  methods: {
    close() {
      this.snackbar.show = false
    },
    next() {
      if (this.snackbar.show) {
        return
      }
      if (this.queue.length > 0) {
        const snack = this.queue.shift()
        this.snackbar.text = snack.text
        this.snackbar.text2 = snack.text2
        this.snackbar.goTo = snack.goTo
        this.snackbar.color = snack.color
        this.snackbar.vertical = snack.text2 !== undefined
        this.snackbar.show = true
      }
    },
    onError(event: ErrorEvent) {
      this.queue.push({
        text: event.message,
        color: 'error',
      })
    },
  },
})
</script>

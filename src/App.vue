<template>

  <v-app id="komf">
    <v-main class="fill-height">
      <LibraryActionsMenu v-if="library"/>
      <SeriesActionsMenu v-if="series"/>
      <Dialogs/>
      <ToasterNotification/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import LibraryActionsMenu from '@/components/LibraryActionsMenu.vue'
import SeriesActionsMenu from '@/components/SeriesActionsMenu.vue'
import Dialogs from '@/components/Dialogs.vue'
import ToasterNotification from '@/components/ToasterNotification.vue'
import {Theme} from '@/types/themes'

export default Vue.extend({
  name: 'App',
  components: {
    LibraryActionsMenu,
    SeriesActionsMenu,
    Dialogs,
    ToasterNotification,
  },
  data: () => {
    return {
      library: false,
      series: false,
    }
  },
  created() {
    let theme = this.getTheme()
    if (theme) {
      this.changeTheme(theme)
    }

    const type = window.location.pathname.split('/')[1]
    if (type == 'libraries') {
      this.library = true
    } else if (type == 'series') {
      this.series = true
    }
  },
  methods: {
    changeTheme(theme: Theme) {
      switch (theme) {
        case Theme.DARK:
          this.$vuetify.theme.dark = true
          break

        case Theme.SYSTEM:
          this.$vuetify.theme.dark = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
          break

        default:
          this.$vuetify.theme.dark = false
          break
      }
    },
    getTheme(): Theme | undefined {
      let storage = localStorage.getItem('vuex')
      if (storage) {
        let state = JSON.parse(storage)
        if ('persistedState' in state) {
          return state.persistedState.theme
        }
      }
    },
  },
})
</script>
<style scoped lang="scss">
::v-deep .v-application--wrap {
  min-height: fit-content;
  background-color: var(--v-contrast-1-base);
}
</style>

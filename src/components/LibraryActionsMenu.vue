<template>
  <div>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click.prevent="">
          <v-icon>mdi-folder-edit</v-icon>
        </v-btn>
      </template>
      <v-list dense>
        <v-list-item @click="autoIdentify">
          <v-list-item-title>Auto-Identify Library</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'LibraryActionsMenu',
  methods: {
    autoIdentify() {
      const libraryId = window.location.pathname.split('/')[2]
      this.$komfMetadata.matchLibrary(libraryId)
    },
  },
})
</script>

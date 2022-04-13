<template>
  <div>

    <IdentifySeriesDialog
      v-model="identifySeriesDialog"
    />
  </div>
</template>

<script lang="ts">
import IdentifySeriesDialog from '@/components/IdentifySeriesDialog.vue'
import Vue from 'vue'

export default Vue.extend({
  name: 'Dialogs',
  components: {
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
  },
})
</script>

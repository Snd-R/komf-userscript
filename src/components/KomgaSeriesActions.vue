<template>
  <q-btn icon="mdi-book-edit"
         flat
         rounded
         padding="0.85em">
    <SeriesActionsMenu/>
  </q-btn>
</template>

<script setup lang="ts">import SeriesActionsMenu from "@/components/SeriesActionsMenu.vue"</script>

<style scoped lang="scss">
@import '../styles/scoped.scss';
</style>

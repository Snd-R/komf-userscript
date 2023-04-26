<template>
  <q-btn icon="fa fa-pen-to-square"
         flat
         padding="0.55em 0 0.55em 0"
         class="q-ml-sm "
         style="background: #6c757d; border-radius: 10%"
  >
    <LibraryActionsMenu />
  </q-btn>
</template>

<script setup lang="ts">import LibraryActionsMenu from '@/components/LibraryActionsMenu.vue'</script>

<style scoped lang="scss">
@import '../styles/scoped.scss';
</style>

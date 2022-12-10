<template>
  <q-btn icon="mdi-folder-edit" flat rounded padding="md">
    <q-menu>
      <q-item clickable v-close-popup @click="autoIdentify">
        <q-item-section class="text-body2 text-weight-medium" no-wrap>Auto-Identify Library</q-item-section>
      </q-item>
      <q-item clickable v-close-popup @click="promptResetLibrary">
        <q-item-section class="text-body2 text-weight-medium" no-wrap>Reset Metadata</q-item-section>
      </q-item>
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import {computed, inject} from 'vue'
import type KomfMetadataService from '../services/komf-metadata.service'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import {komfMetadataKey} from '@/injection-keys'
import {useErrorNotification} from '@/errorNotification'
import {useQuasar} from 'quasar';

const $q = useQuasar();
const metadataService = inject<KomfMetadataService>(komfMetadataKey) as KomfMetadataService

const libraryId = computed(() => {
  return window.location.pathname.split('/')[2]
})

async function autoIdentify() {
  try {
    await metadataService.matchLibrary(libraryId.value)
  } catch (e) {
    useErrorNotification(e)
    return
  }
  $q.notify({
    message: 'Launched library scan',
    color: 'secondary',
    closeBtn: true,
    timeout: 5000
  });
}

function promptResetLibrary() {
  $q.dialog({
    component: ConfirmationDialog,

    componentProps: {
      title: 'Reset Library',
      bodyHtml: 'All metadata of all series inside this library  will be reset including field locks and thumbnails uploaded by Komf. No files will be modified. Continue?',
      confirmText: 'Yes, reset library',
      buttonConfirm: 'Reset',
      buttonConfirmColor: 'negative'
    }
  }).onOk(() => {
    resetLibrary()
  })
}

async function resetLibrary() {
  try {
    await metadataService?.resetLibrary(libraryId.value)
  } catch (e) {
    useErrorNotification(e)
  }
}
</script>

<style scoped lang="scss">
@import '../styles/fixed.scss';
</style>

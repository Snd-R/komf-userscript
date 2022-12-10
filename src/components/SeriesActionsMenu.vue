<template>
  <q-btn icon="mdi-book-edit" flat rounded padding="md">
    <q-menu>
      <q-item dense clickable @click="promptIdentifySeries" v-close-popup>
        <q-item-section no-wrap>Identify</q-item-section>
      </q-item>
      <q-item dense clickable @click="autoIdentify" v-close-popup>
        <q-item-section no-wrap>Auto-Identify</q-item-section>
      </q-item>
      <q-item dense clickable @click="promptResetSeries" v-close-popup>
        <q-item-section no-wrap>Reset Metadata</q-item-section>
      </q-item>
    </q-menu>
  </q-btn>

  <q-dialog v-model="loading" maximized transition-duration="0">
    <div class="q-pa-md flex flex-center" style="background-color: rgba(89, 89, 89, 0.5)">
      <q-circular-progress indeterminate rounded size="50px" color="lime" class="q-ma-md"/>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed, inject, ref} from 'vue'
import type KomfMetadataService from '../services/komf-metadata.service'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import IdentifySeriesDialog from '@/components/IdentifySeriesDialog.vue'
import {komfMetadataKey} from '@/injection-keys'
import {useQuasar} from 'quasar'
import {useErrorNotification} from '@/errorNotification'

const $q = useQuasar()
const metadataService = inject<KomfMetadataService>(
    komfMetadataKey
) as KomfMetadataService
const loading = ref(false)
const title = computed(() => {
  return (
      document.querySelector(
          '.v-main__wrap .v-toolbar__content .v-toolbar__title span'
      ) as HTMLElement
  ).innerText
})
const seriesId = computed(() => {
  return window.location.pathname.split('/')[2]
})

function promptIdentifySeries() {
  $q.dialog({
    component: IdentifySeriesDialog,

    componentProps: {
      seriesTitle: title.value,
    }
  })
}

function promptResetSeries() {
  $q.dialog({
    component: ConfirmationDialog,

    componentProps: {
      title: 'Reset Series',
      bodyHtml: 'All series metadata will be reset including field locks and thumbnails uploaded by Komf. No files will be modified. Continue?',
      confirmText: 'Yes, reset series',
      buttonConfirm: 'Reset',
      buttonConfirmColor: 'negative'
    }
  }).onOk(() => {
    resetSeries()
  })
}

async function resetSeries() {
  try {
    await metadataService?.resetSeries(seriesId.value)
  } catch (e) {
    useErrorNotification(e)
  }
}

async function autoIdentify() {
  loading.value = true
  try {
    await metadataService.matchSeries(seriesId.value)
  } catch (e) {
    useErrorNotification(e)
  }
  loading.value = false
}
</script>

<style scoped lang="scss">
@import '../styles/fixed.scss';
</style>

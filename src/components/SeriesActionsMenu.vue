<template>
  <q-menu class="text-body2 text-weight-medium">
    <q-item clickable @click="promptIdentifySeries" v-close-popup>
      <q-item-section no-wrap>Identify</q-item-section>
    </q-item>
    <q-item clickable @click="autoIdentify" v-close-popup>
      <q-item-section no-wrap>Auto-Identify</q-item-section>
    </q-item>
    <q-item clickable @click="promptResetSeries" v-close-popup>
      <q-item-section no-wrap>Reset Metadata</q-item-section>
    </q-item>
  </q-menu>

  <q-dialog v-model="loading" maximized transition-duration="0">
    <div class="q-pa-md flex flex-center" style="background-color: rgba(89, 89, 89, 0.5)">
      <q-circular-progress indeterminate rounded size="50px" color="lime" class="q-ma-md"/>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue'
import type KomfMetadataService from '../services/komf-metadata.service'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import IdentifySeriesDialog from '@/components/IdentifySeriesDialog.vue'
import {komfMetadataKey} from '@/injection-keys'
import MediaServer from "@/types/mediaServer";
import {useQuasar} from 'quasar'
import {errorNotification} from '@/errorNotification'
import {useSettingsStore} from "@/stores/settings";

const $q = useQuasar()
const metadataService = inject<KomfMetadataService>(komfMetadataKey) as KomfMetadataService
const settings = useSettingsStore()

const loading = ref(false)

function seriesTitle() {
  if (settings.mediaServer == MediaServer.Komga)
    return (document.querySelector('.v-main__wrap .v-toolbar__content .v-toolbar__title span') as HTMLElement).innerText
  else
    return (document.querySelector('app-series-detail app-side-nav-companion-bar div h2 span') as HTMLElement).innerText
}

function seriesId() {
  if (settings.mediaServer == MediaServer.Komga)
    return window.location.pathname.split('/')[2]
  else
    return window.location.pathname.split('/')[4]
}

function libraryId() {
  if (settings.mediaServer == MediaServer.Komga) {
    return Array.from(document.querySelector('.v-main__wrap .v-toolbar__content')?.children ?? [])
        .find(el => {
          let link = el.getAttribute('href')
          if (!link) return false
          return /\/libraries.*/.test(link)
        })!.getAttribute("href")!.split('/')[2]
  } else {
    let pathTokens = window.location.pathname.split('/')
    return pathTokens[2]
  }
}

function promptIdentifySeries() {
  $q.dialog({
    component: IdentifySeriesDialog,

    componentProps: {
      seriesTitle: seriesTitle(),
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
    await metadataService?.resetSeries(libraryId(), seriesId())
  } catch (e) {
    errorNotification(e, $q)
  }
}

async function autoIdentify() {
  loading.value = true
  try {
    await metadataService.matchSeries(libraryId(), seriesId())
  } catch (e) {
    errorNotification(e, $q)
  }
  loading.value = false
}
</script>

<style scoped lang="scss">
@import '../styles/scoped.scss';
</style>

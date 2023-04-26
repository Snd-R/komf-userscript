<template>
  <q-menu class="text-body2 text-weight-medium">
    <q-item clickable v-close-popup @click="autoIdentify">
      <q-item-section class="text-body2 text-weight-medium" no-wrap>Auto-Identify Library</q-item-section>
    </q-item>
    <q-item clickable v-close-popup @click="promptResetLibrary">
      <q-item-section class="text-body2 text-weight-medium" no-wrap>Reset Metadata</q-item-section>
    </q-item>
  </q-menu>
</template>

<script setup lang="ts">
import { inject } from 'vue'
import type KomfMetadataService from '../services/komf-metadata.service'
import ConfirmationDialog from '@/components/ConfirmationDialog.vue'
import { komfMetadataKey } from '@/injection-keys'
import { errorNotification } from '@/errorNotification'
import { useQuasar } from 'quasar'
import { useSettingsStore } from '@/stores/settings'
import MediaServer from '@/types/mediaServer'

const $q = useQuasar()
const metadataService = inject<KomfMetadataService>(komfMetadataKey) as KomfMetadataService
const settings = useSettingsStore()

function libraryId() {
    let pathTokens = window.location.pathname.split('/')
    if (settings.mediaServer == MediaServer.Komga) {
        return pathTokens[pathTokens.findIndex(el => el == 'libraries') + 1]
    } else {
        return pathTokens[pathTokens.findIndex(el => el == 'library') + 1]
    }
}

async function autoIdentify() {
    try {
        await metadataService.matchLibrary(libraryId())
    } catch (e) {
        errorNotification(e, $q)
        return
    }
    $q.notify({
        message: 'Launched library scan',
        color: 'secondary',
        closeBtn: true,
        timeout: 5000
    })
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
        await metadataService?.resetLibrary(libraryId())
    } catch (e) {
        errorNotification(e, $q)
    }
}
</script>

<style scoped lang="scss">
@import '../styles/scoped.scss';
</style>

<template>
  <KomgaView v-if="komga" />
  <KavitaView v-if="kavita" />
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings'
import MediaServer from '@/types/mediaServer'
import KomgaView from '@/KomgaView.vue'
import { ref } from 'vue'
import KavitaView from '@/KavitaView.vue'
import { useQuasar } from 'quasar'
import mdiIconSet from 'quasar/icon-set/mdi-v6.js'
import fontAwesomeIconSet from 'quasar/icon-set/fontawesome-v6.js'

const $q = useQuasar()
const settings = useSettingsStore()
const title = document.title.split(' ')[0]
const komga = ref(false)
const kavita = ref(false)

if (title == 'Komga') {
    komga.value = true
    settings.mediaServer = MediaServer.Komga
    $q.iconSet.set(mdiIconSet)
} else if (title == 'Kavita') {
    kavita.value = true
    settings.mediaServer = MediaServer.Kavita
    $q.iconSet.set(fontAwesomeIconSet)
}

</script>

<style scoped lang="scss">
@import '@/styles/scoped.scss';
</style>
<style lang="scss">
@import '@/styles/global-overrides.scss';
</style>

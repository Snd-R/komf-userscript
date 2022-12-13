<template>
  <KomgaView v-if="komga"/>
  <KavitaView v-if="kavita"/>
</template>

<script setup lang="ts">
import {useSettingsStore} from '@/stores/settings'
import MediaServer from "@/types/mediaServer";
import KomgaView from "@/KomgaView.vue";
import {ref} from 'vue'
import KavitaView from "@/KavitaView.vue";

const settings = useSettingsStore()
const title = document.title.split(' ')[0]
const komga = ref(false)
const kavita = ref(false)

if (title == 'Komga') {
  komga.value = true
  settings.mediaServer = MediaServer.Komga
} else if (title == 'Kavita') {
  kavita.value = true
  settings.mediaServer = MediaServer.Kavita
}

</script>

<style scoped lang="scss">
@import '@/styles/scoped.scss';
</style>

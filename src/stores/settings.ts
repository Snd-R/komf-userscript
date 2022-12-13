import {defineStore} from 'pinia'
import {useStorage} from '@vueuse/core'
import {type Ref, ref} from 'vue'
import type MediaServer from '@/types/mediaServer'

export const useSettingsStore = defineStore('settings', () => {
    const komfUrl = useStorage('komf-url', 'http://localhost:8085')
    const mediaServer: Ref<MediaServer | undefined> = ref()
    return {komfUrl, mediaServer}
})

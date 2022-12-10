import {defineStore} from 'pinia'
import {useStorage} from '@vueuse/core'

export const useSettingsStore = defineStore('settings', () => {
    const komfUrl = useStorage('komf-url', 'http://localhost:8085')
    return {komfUrl}
})

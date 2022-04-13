import {AxiosInstance} from 'axios'
import _Vue from 'vue'
import KomfMetadataService from '@/services/komf-metadata.service'

export default {
  install(
    Vue: typeof _Vue,
    {http}: { http: AxiosInstance }) {
    Vue.prototype.$komfMetadata = new KomfMetadataService(http)
  },
}

declare module 'vue/types/vue' {
  interface Vue {
    $komfMetadata: KomfMetadataService;
  }
}

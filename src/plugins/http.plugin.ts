import axios, {AxiosInstance, AxiosRequestConfig} from 'axios'
import _Vue from 'vue'

export default {
  install(Vue: typeof _Vue, baseUrl: string) {
    Vue.prototype.$http = axios.create({
      baseURL: baseUrl,
      headers: {'X-Requested-With': 'XMLHttpRequest'},
    } as AxiosRequestConfig)
  },
}

declare module 'vue/types/vue' {
  interface Vue {
    $komfHttp: AxiosInstance;
  }
}

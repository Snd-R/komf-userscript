import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios, { type AxiosRequestConfig } from 'axios'
import KomfMetadataService from '@/services/komf-metadata.service'
import { httpKey, komfConfigKey, komfMetadataKey } from '@/injection-keys'
import { Dialog, Notify, Quasar } from 'quasar'
import 'quasar/src/css/index.sass'

import App from './App.vue'
import KomfConfigService from '@/services/komf-config.service'

const mountElement = document.createElement('div')
mountElement.id = 'komf'
document.body.appendChild(mountElement)

let app = createApp(App)
app.use(Quasar, { plugins: { Notify, Dialog } })
app.use(createPinia())

const http = axios.create({ headers: { 'X-Requested-With': 'XMLHttpRequest' } } as AxiosRequestConfig)
const komfMetadata = new KomfMetadataService(http)
const komfConfig = new KomfConfigService(http)

app.provide(httpKey, http)
app.provide(komfMetadataKey, komfMetadata)
app.provide(komfConfigKey, komfConfig)

app.mount(mountElement)

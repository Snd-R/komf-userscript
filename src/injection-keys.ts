import type {InjectionKey} from 'vue'
import type {AxiosInstance} from 'axios'
import type KomfMetadataService from './services/komf-metadata.service'

export const httpKey = Symbol() as InjectionKey<AxiosInstance>
export const komfMetadataKey = Symbol() as InjectionKey<KomfMetadataService>

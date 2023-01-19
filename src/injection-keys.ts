import type {InjectionKey} from 'vue'
import type {AxiosInstance} from 'axios'
import type KomfMetadataService from './services/komf-metadata.service'
import type KomfConfigService from "@/services/komf-config.service";

export const httpKey = Symbol() as InjectionKey<AxiosInstance>
export const komfMetadataKey = Symbol() as InjectionKey<KomfMetadataService>
export const komfConfigKey = Symbol() as InjectionKey<KomfConfigService>

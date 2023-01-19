import axios, {type AxiosInstance} from 'axios'
import {useSettingsStore} from '@/stores/settings'
import type {KomfConfigDto, KomfConfigUpdateDto} from "@/types/komf-config";

export default class KomfConfigService {
    private http: AxiosInstance
    private settings = useSettingsStore()

    constructor(http: AxiosInstance) {
        this.http = http
    }


    async getConfig(): Promise<KomfConfigDto> {
        return this.getConfigFromUrl(this.settings.komfUrl)
    }

    async getConfigFromUrl(url: string): Promise<KomfConfigDto> {
        let config
        try {
            config = (await this.http.get(`${url}/config`)).data
        } catch (e: unknown) {
            let msg = 'Failed to retrieve config'

            if (axios.isAxiosError(e)) {
                msg = e.message
            }
            throw new Error(msg)
        }

        if (typeof config != 'object' || !('metadataProviders' in config)) {
            throw new Error('Connection Failed')
        }

        return config
    }

    async updateConfig(config: KomfConfigUpdateDto) {
        try {
            await this.http.patch(`${this.settings.komfUrl}/config`, config)
        } catch (e: unknown) {
            let msg = 'Failed to retrieve config'

            if (axios.isAxiosError(e)) {
                msg = e.message
            }
            throw new Error(msg)
        }
    }
}

import {AxiosInstance} from 'axios'
import {IdentifyRequest, SearchResult} from '@/types/metadata'

const qs = require('qs')

export default class KomfMetadataService {
  private http: AxiosInstance

  constructor(http: AxiosInstance) {
    this.http = http
  }

  async searchSeries(seriesName: string): Promise<SearchResult[]> {
    try {
      return (await this.http.get('/search', {
        params: {name: seriesName},
        paramsSerializer: params => qs.stringify(params, {indices: false}),
      })).data
    } catch (e) {
      let msg = 'An error occurred while trying to retrieve search results'
      if (e.response.data.message) {
        msg += `: ${e.response.data.message}`
      }
      throw new Error(msg)
    }
  }

  async identifySeries(request: IdentifyRequest) {
    try {
      await this.http.post('identify', request)
    } catch (e) {
      let msg = 'An error occurred while trying to identify series'
      if (e.response.data.message) {
        msg += `: ${e.response.data.message}`
      }
      throw new Error(msg)
    }
  }

  async matchLibrary(libraryId: string) {
    try {
      await this.http.post(`match/library/${libraryId}`)
    } catch (e) {
      let msg = 'An error occurred while trying to identify series'
      if (e.response.data.message) {
        msg += `: ${e.response.data.message}`
      }
      throw new Error(msg)
    }
  }

  async matchSeries(seriesId: string) {
    try {
      await this.http.post(`match/series/${seriesId}`)
    } catch (e) {
      let msg = 'An error occurred while trying to identify series'
      if (e.response.data.message) {
        msg += `: ${e.response.data.message}`
      }
      throw new Error(msg)
    }
  }

  async resetSeries(seriesId: string) {
    try {
      await this.http.post(`reset/series/${seriesId}`)
    } catch (e) {
      let msg = 'An error occurred while trying to identify series'
      if (e.response.data.message) {
        msg += `: ${e.response.data.message}`
      }
      throw new Error(msg)
    }
  }

  async resetLibrary(libraryId: string) {
    try {
      await this.http.post(`reset/library/${libraryId}`)
    } catch (e) {
      let msg = 'An error occurred while trying to identify series'
      if (e.response.data.message) {
        msg += `: ${e.response.data.message}`
      }
      throw new Error(msg)
    }
  }

}

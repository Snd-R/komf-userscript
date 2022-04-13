export interface SearchResult {
  imageUrl: string,
  title: string,
  provider: string
  resultId: string,
}

export interface IdentifyRequest {
  seriesId: string,
  provider: string,
  providerSeriesId: string
}

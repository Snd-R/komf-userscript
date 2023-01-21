export interface SearchResult {
    imageUrl: string,
    title: string,
    provider: string
    resultId: string,
}

export interface IdentifyRequest {
    libraryId?: string,
    seriesId: string,
    provider: string,
    providerSeriesId: string,
    edition?: string
}

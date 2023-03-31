export interface KomfConfigUpdateDto {
    komga?: KomgaConfigUpdateDto,
    kavita?: KavitaConfigUpdateDto,
    discord?: DiscordConfigUpdateDto,
    metadataProviders?: MetadataProvidersConfigUpdateDto
}

export interface KomgaConfigUpdateDto {
    baseUri?: string,
    komgaUser?: string,
    komgaPassword?: string,
    eventListener?: EventListenerConfigUpdateDto,
    notifications?: NotificationConfigUpdateDto,
    metadataUpdate?: MetadataUpdateConfigUpdateDto,
}

export interface KavitaConfigUpdateDto {
    baseUri?: string,
    apiKey?: string,
    eventListener?: EventListenerConfigUpdateDto,
    notifications?: NotificationConfigUpdateDto,
    metadataUpdate?: MetadataUpdateConfigUpdateDto,
    aggregateMetadata?: boolean,
}

export interface DiscordConfigUpdateDto {
    webhooks?: Record<number, (string | null)>,
    seriesCover?: boolean,
}

export interface EventListenerConfigUpdateDto {
    enabled?: boolean,
    libraries?: string[]

}

export interface NotificationConfigUpdateDto {
    libraries?: string [],
}

export interface MetadataUpdateConfigUpdateDto {
    default?: MetadataProcessingConfigUpdateDto,
    library?: Record<string, MetadataProcessingConfigUpdateDto | null>
}

export interface MetadataProcessingConfigUpdateDto {
    aggregate?: boolean,
    mergeTags?: boolean,
    mergeGenres?: boolean,
    bookCovers?: boolean,
    seriesCovers?: boolean,
    updateModes?: string[],
    postProcessing?: MetadataPostProcessingConfigUpdateDto
}

export interface MetadataPostProcessingConfigUpdateDto {
    seriesTitle?: boolean,
    seriesTitleLanguage?: string,
    orderBooks?: boolean,
    alternativeSeriesTitles?: boolean,
    alternativeSeriesTitleLanguages?: string[],
    readingDirectionValue?: string | null,
    languageValue?: string | null,
}

export interface MetadataProvidersConfigUpdateDto {
    malClientId?: string,
    nameMatchingMode?: string,
    defaultProviders?: ProvidersConfigUpdateDto,
    libraryProviders?: Record<string, ProvidersConfigUpdateDto>,
}

export interface ProvidersConfigUpdateDto {
    mangaUpdates?: ProviderConfigUpdateDto,
    mal?: ProviderConfigUpdateDto,
    nautiljon?: ProviderConfigUpdateDto,
    aniList?: ProviderConfigUpdateDto,
    yenPress?: ProviderConfigUpdateDto,
    kodansha?: ProviderConfigUpdateDto,
    viz?: ProviderConfigUpdateDto,
    bookWalker?: ProviderConfigUpdateDto,
    mangaDex?: ProviderConfigUpdateDto,
}

export interface ProviderConfigUpdateDto {
    mediaType?: string,
    nameMatchingMode?: string,
    authorRoles?: string[],
    artistRoles?: string[],
    priority?: number,
    enabled?: boolean,
    seriesMetadata?: SeriesMetadataConfigUpdateDto,
    bookMetadata?: BookMetadataConfigUpdateDto,
}

export interface SeriesMetadataConfigUpdateDto {
    status?: boolean
    title?: boolean
    summary?: boolean
    publisher?: boolean
    readingDirection?: boolean
    ageRating?: boolean
    language?: boolean
    genres?: boolean
    tags?: boolean
    totalBookCount?: boolean
    authors?: boolean
    releaseDate?: boolean
    thumbnail?: boolean
    books?: boolean
    useOriginalPublisher?: boolean
    links?: boolean,

    originalPublisherTagName?: string
    englishPublisherTagName?: string
    frenchPublisherTagName?: string
}

export interface BookMetadataConfigUpdateDto {
    title?: boolean,
    summary?: boolean,
    number?: boolean,
    releaseDate?: boolean,
    authors?: boolean,
    tags?: boolean,
    isbn?: boolean,
    links?: boolean,
    thumbnail?: boolean,
}

export interface KomfConfigDto {
    komga: KomgaConfigDto,
    kavita: KavitaConfigDto,
    discord: DiscordConfigDto,
    metadataProviders: MetadataProvidersConfigDto
}

export interface KomgaConfigDto {
    baseUri: string,
    komgaUser: string,
    eventListener: EventListenerConfigDto,
    notifications: NotificationConfigDto,
    metadataUpdate: MetadataUpdateConfigDto,
}

export interface KavitaConfigDto {
    baseUri: string,
    eventListener: EventListenerConfigDto,
    notifications: NotificationConfigDto,
    metadataUpdate: MetadataUpdateConfigDto,
}

export interface DiscordConfigDto {
    webhooks?: Record<number, string>,
    seriesCover: boolean,
}

export interface EventListenerConfigDto {
    enabled: boolean,
    libraries: string[]

}

export interface NotificationConfigDto {
    libraries: string[],
}

export interface MetadataUpdateConfigDto {
    default: MetadataProcessingConfigDto,
    library: Record<string, MetadataProcessingConfigDto>
}

export interface MetadataProcessingConfigDto {
    aggregate: boolean,
    mergeTags: boolean,
    mergeGenres: boolean,
    bookCovers: boolean,
    seriesCovers: boolean,
    updateModes: string[],
    postProcessing: MetadataPostProcessingConfigDto
}

export interface MetadataPostProcessingConfigDto {
    seriesTitle: boolean,
    seriesTitleLanguage: string,
    orderBooks: boolean,
    alternativeSeriesTitles: boolean,
    alternativeSeriesTitleLanguages: string[],
    readingDirectionValue?: string,
    languageValue?: string,
}

export interface MetadataProvidersConfigDto {
    malClientId: string,
    nameMatchingMode: string,
    defaultProviders: ProvidersConfigDto,
    libraryProviders: Record<string, ProvidersConfigDto>,
}

export interface ProvidersConfigDto {
    mangaUpdates: ProviderConfigDto,
    mal: ProviderConfigDto,
    nautiljon: ProviderConfigDto,
    aniList: ProviderConfigDto,
    yenPress: ProviderConfigDto,
    kodansha: ProviderConfigDto,
    viz: ProviderConfigDto,
    bookWalker: ProviderConfigDto,

    mangaDex: ProviderConfigDto,
}

export interface ProviderConfigDto {
    mediaType: string,
    nameMatchingMode?: string,
    authorRoles: string[],
    artistRoles: string[],
    priority: number,
    enabled: boolean,
    seriesMetadata: SeriesMetadataConfigDto,
    bookMetadata: BookMetadataConfigDto,
}

export interface SeriesMetadataConfigDto {
    status: boolean
    title: boolean
    summary: boolean
    publisher: boolean
    readingDirection: boolean
    ageRating: boolean
    language: boolean
    genres: boolean
    tags: boolean
    totalBookCount: boolean
    authors: boolean
    releaseDate: boolean
    thumbnail: boolean
    links: boolean
    books: boolean
    useOriginalPublisher: boolean

    originalPublisherTagName?: string
    englishPublisherTagName?: string
    frenchPublisherTagName?: string
}

export interface BookMetadataConfigDto {
    title: boolean,
    summary: boolean,
    number: boolean,
    releaseDate: boolean,
    authors: boolean,
    tags: boolean,
    isbn: boolean,
    links: boolean,
    thumbnail: boolean,
}

export class DefaultSeriesMetadataConfig implements SeriesMetadataConfigDto {
    ageRating: boolean = true;
    authors: boolean = true;
    books: boolean = true;
    genres: boolean = true;
    language: boolean = true;
    links: boolean = true;
    publisher: boolean = true;
    readingDirection: boolean = true;
    releaseDate: boolean = true;
    status: boolean = true;
    summary: boolean = true;
    tags: boolean = true;
    thumbnail: boolean = true;
    title: boolean = true;
    totalBookCount: boolean = true;
    useOriginalPublisher: boolean = false;
}

export class DefaultBookMetadataConfig implements BookMetadataConfigDto {
    authors: boolean = true;
    isbn: boolean = true;
    links: boolean = true;
    number: boolean = true;
    releaseDate: boolean = true;
    summary: boolean = true;
    tags: boolean = true;
    thumbnail: boolean = true;
    title: boolean = true;
}

export class DefaultProviderConfig implements ProviderConfigDto {
    enabled: boolean = false;
    priority: number = 10;
    authorRoles: string[] = ['WRITER']
    artistRoles: string[] = ['PENCILLER', 'INKER', 'COLORIST', 'LETTERER', 'COVER']
    mediaType: string = 'MANGA'
    seriesMetadata: SeriesMetadataConfigDto = new DefaultSeriesMetadataConfig();
    bookMetadata: BookMetadataConfigDto = new DefaultBookMetadataConfig();
}

export class DefaultProvidersConfig implements ProvidersConfigDto {
    aniList: ProviderConfigDto = new DefaultProviderConfig();
    bookWalker: ProviderConfigDto = new DefaultProviderConfig();
    kodansha: ProviderConfigDto = new DefaultProviderConfig();
    mal: ProviderConfigDto = new DefaultProviderConfig;
    mangaUpdates: ProviderConfigDto = new DefaultProviderConfig;
    nautiljon: ProviderConfigDto = new DefaultProviderConfig;
    viz: ProviderConfigDto = new DefaultProviderConfig;
    yenPress: ProviderConfigDto = new DefaultProviderConfig;
    mangaDex: ProviderConfigDto = new DefaultProviderConfig;
}

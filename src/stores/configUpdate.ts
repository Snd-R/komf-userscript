import {defineStore} from 'pinia'
import type {Ref} from 'vue'
import {reactive, ref} from 'vue'
import type {
    BookMetadataConfigDto,
    BookMetadataConfigUpdateDto,
    DiscordConfigDto,
    DiscordConfigUpdateDto,
    EventListenerConfigDto,
    EventListenerConfigUpdateDto,
    KavitaConfigDto,
    KavitaConfigUpdateDto,
    KomfConfigDto,
    KomfConfigUpdateDto,
    KomgaConfigDto,
    KomgaConfigUpdateDto,
    MetadataPostProcessingConfigUpdateDto,
    MetadataProcessingConfigDto,
    MetadataProcessingConfigUpdateDto,
    MetadataProvidersConfigUpdateDto,
    MetadataUpdateConfigDto,
    MetadataUpdateConfigUpdateDto,
    NotificationConfigDto,
    NotificationConfigUpdateDto,
    ProviderConfigDto,
    ProviderConfigUpdateDto,
    ProvidersConfigDto,
    ProvidersConfigUpdateDto,
    SeriesMetadataConfigDto,
    SeriesMetadataConfigUpdateDto
} from "@/types/komf-config";
import {DefaultProviderConfig} from "@/types/komf-config";
import {useSettingsStore} from "@/stores/settings";
import MediaServer from "@/types/mediaServer";

export const useConfigUpdateStore = defineStore('settingsUpdate', () => {
    const settings = useSettingsStore()
    const libraries = ref([{id: '', name: ''}])
    const currentConfig: Ref<KomfConfigDto | null> = ref(null)
    const providersWithBooks = ['nautiljon', 'yenPress', 'kodansha', 'viz', 'bookWalker', "mangaDex"]
    const providersWithMediaType = ['mangaUpdates', 'mal', 'nautiljon', 'aniList', 'yenPress', 'bookWalker']

    const notifications = reactive({
        komgaLibraries: [] as { name: string | undefined, id: string }[] | null,
        kavitaLibraries: [] as { name: string | undefined, id: string }[] | null,
        webhooks: [
            {
                value: '' as string | null,
                existing: false
            }
        ],
        seriesCover: false,
        imgurClientId: '',
        imgurClientIdDisabled: false
    })

    const metadataProviders = reactive({
        malClientId: '',
        malClientIdDisabled: false,
        nameMatchingMode: 'CLOSEST_MATCH',
        defaultProviders: [{
            name: 'MangaUpdates',
            books: false,
            mediaTypeEnabled: false,
            ...new DefaultProviderConfig() as ProviderConfigDto
        }],

        defaultDisabledProviders: [{
            name: 'MangaUpdates',
            books: false,
            mediaTypeEnabled: false,
            ...new DefaultProviderConfig() as ProviderConfigDto
        }],
        libraryProviders: [{
            id: '123',
            name: '',
            deleted: false,
            providers: [{
                name: 'MangaUpdates',
                books: false,
                mediaTypeEnabled: false,
                ...new DefaultProviderConfig() as ProviderConfigDto
            }],
            disabledProviders: [{
                name: 'MangaUpdates',
                books: false,
                mediaTypeEnabled: false,
                ...new DefaultProviderConfig() as ProviderConfigDto
            }]
        }]
    })

    const komgaMetadata = reactive({
        default: {
            aggregateMetadata: false,
            modes: ['API'],
            bookCovers: false,
            seriesCovers: false,
            seriesTitle: false,
            seriesTitleLanguage: 'en',
            alternativeTitles: false,
            alternativeTitleLanguages: ['en', 'ja', 'ja-ro'],
            orderBooks: false,
            readingDirectionValue: null,
            languageValue: null,
        } as ProcessingUpdateModel,
        library: [] as ProcessingLibraryUpdateModel[]
    })

    const komga = reactive({
        baseUri: 'http://localhost:8080',
        user: 'admin@example.org',
        password: '',
        passwordDisabled: true,
        eventListener: {
            enabled: false,
            libraries: [] as { name: string | undefined, id: string }[] | null
        }
    })

    const kavita = reactive({
        baseUri: 'http://localhost:5000',
        apiKey: '',
        eventListener: {
            enabled: false,
            libraries: [] as { name: string | undefined, id: string }[] | null
        }
    })
    const kavitaMetadata = reactive({
        default: {
            aggregateMetadata: false,
            modes: ['API'],
            bookCovers: false,
            seriesCovers: false,
            seriesTitle: false,
            seriesTitleLanguage: 'en',
            alternativeTitles: false,
            alternativeTitleLanguages: ["ja"],
            languageValue: null,
        } as ProcessingUpdateModel,
        library: [] as ProcessingLibraryUpdateModel[]
    })

    function reset(config: KomfConfigDto) {
        libraries.value = getLibraries()
        currentConfig.value = structuredClone(config)

        notifications.webhooks = Object.entries(config.discord?.webhooks ?? {})
            .map(([, value]) => {
                return {value: value, existing: true}
            })
        notifications.seriesCover = config.discord?.seriesCover
        notifications.imgurClientId = config.discord?.imgurClientId ?? ''
        notifications.imgurClientIdDisabled = config.discord?.imgurClientId != undefined
        notifications.komgaLibraries = config.komga.notifications.libraries
            .map(id => {
                return {
                    name: libraries.value.find(library => library.id == id)?.name,
                    id: id
                }
            })
        notifications.kavitaLibraries = config.kavita.notifications.libraries
            .map(id => {
                return {
                    name: libraries.value.find(library => library.id == id)?.name,
                    id: id
                }
            })

        metadataProviders.malClientId = config.metadataProviders.malClientId
        metadataProviders.malClientIdDisabled = config.metadataProviders.malClientId != ''
        metadataProviders.nameMatchingMode = config.metadataProviders.nameMatchingMode
        metadataProviders.defaultProviders = Object.entries(config.metadataProviders.defaultProviders)
            .sort((a, b) => a[1].priority - b[1].priority)
            .map(([key, value]) => {
                let books = providersWithBooks.includes(key)
                let mediaType = providersWithMediaType.includes(key)
                return {...(value as ProviderConfigDto), name: key, books: books, mediaTypeEnabled: mediaType}
            }).filter(provider => provider.enabled)

        metadataProviders.defaultDisabledProviders = Object.entries(config.metadataProviders.defaultProviders)
            .map(([key, value]) => {
                let books = providersWithBooks.includes(key)
                let mediaType = providersWithMediaType.includes(key)
                return {...(value as ProviderConfigDto), name: key, books: books, mediaTypeEnabled: mediaType}
            }).filter(provider => !provider.enabled)
            .sort((a, b) => a.name.localeCompare(b.name))

        metadataProviders.libraryProviders = Object.entries(config.metadataProviders.libraryProviders)
            .map(([key, value]) => {
                return {
                    id: key,
                    name: libraries.value.find(l => l.id == key)?.name ?? '',
                    deleted: false,
                    providers: Object.entries(value as ProvidersConfigDto)
                        .sort((a, b) => a[1].priority - b[1].priority)
                        .map(([key, value]) => {
                            let books = providersWithBooks.includes(key)
                            let mediaType = providersWithMediaType.includes(key)
                            return {...value as ProviderConfigDto, name: key, books: books, mediaTypeEnabled: mediaType}
                        }).filter(provider => provider.enabled),
                    disabledProviders: Object.entries(value as ProvidersConfigDto).map(([key, value]) => {
                        let books = providersWithBooks.includes(key)
                        let mediaType = providersWithMediaType.includes(key)
                        return {...value as ProviderConfigDto, name: key, books: books, mediaTypeEnabled: mediaType}
                    }).filter(provider => !provider.enabled)
                }
            })

        komga.baseUri = config.komga.baseUri
        komga.user = config.komga.komgaUser
        komga.password = ''
        komga.passwordDisabled = true
        komga.eventListener.enabled = config.komga.eventListener.enabled
        komga.eventListener.libraries = config.komga.eventListener.libraries
            .map(id => {
                return {
                    name: libraries.value.find(library => library.id == id)?.name,
                    id: id
                }
            })

        komgaMetadata.default.aggregateMetadata = config.komga.metadataUpdate.default.aggregate
        komgaMetadata.default.modes = config.komga.metadataUpdate.default.updateModes
        komgaMetadata.default.bookCovers = config.komga.metadataUpdate.default.bookCovers
        komgaMetadata.default.seriesCovers = config.komga.metadataUpdate.default.seriesCovers
        komgaMetadata.default.seriesTitle = config.komga.metadataUpdate.default.postProcessing.seriesTitle
        komgaMetadata.default.seriesTitleLanguage = config.komga.metadataUpdate.default.postProcessing.seriesTitleLanguage
        komgaMetadata.default.orderBooks = config.komga.metadataUpdate.default.postProcessing.orderBooks
        komgaMetadata.default.readingDirectionValue = config.komga.metadataUpdate.default.postProcessing.readingDirectionValue
        komgaMetadata.default.languageValue = config.komga.metadataUpdate.default.postProcessing.languageValue
        komgaMetadata.default.alternativeTitles = config.komga.metadataUpdate.default.postProcessing.alternativeSeriesTitles
        komgaMetadata.default.alternativeTitleLanguages = config.komga.metadataUpdate.default.postProcessing.alternativeSeriesTitleLanguages

        komgaMetadata.library = Object.entries(config.komga.metadataUpdate.library)
            .map(([libraryId, libraryConfig]) => {
                return {
                    id: libraryId,
                    name: libraries.value.find(l => l.id == libraryId)?.name ?? '',
                    deleted: false,
                    aggregateMetadata: libraryConfig.aggregate,
                    modes: libraryConfig.updateModes,
                    bookCovers: libraryConfig.bookCovers,
                    seriesCovers: libraryConfig.seriesCovers,
                    seriesTitle: libraryConfig.postProcessing.seriesTitle,
                    seriesTitleLanguage: libraryConfig.postProcessing.seriesTitleLanguage,
                    orderBooks: libraryConfig.postProcessing.orderBooks,
                    readingDirectionValue: libraryConfig.postProcessing.readingDirectionValue,
                    languageValue: libraryConfig.postProcessing.languageValue,
                    alternativeTitles: libraryConfig.postProcessing.alternativeSeriesTitles,
                    alternativeTitleLanguages: libraryConfig.postProcessing.alternativeSeriesTitleLanguages
                }
            })

        kavita.baseUri = config.kavita.baseUri
        kavita.eventListener.enabled = config.kavita.eventListener.enabled
        kavita.eventListener.libraries = config.kavita.eventListener.libraries
            .map(id => {
                return {
                    name: libraries.value.find(library => library.id == id)?.name,
                    id: id
                }
            })
        kavita.apiKey = ''

        kavitaMetadata.default.aggregateMetadata = config.kavita.metadataUpdate.default.aggregate
        kavitaMetadata.default.modes = config.kavita.metadataUpdate.default.updateModes
        kavitaMetadata.default.bookCovers = config.kavita.metadataUpdate.default.bookCovers
        kavitaMetadata.default.seriesCovers = config.kavita.metadataUpdate.default.seriesCovers
        kavitaMetadata.default.seriesTitle = config.kavita.metadataUpdate.default.postProcessing.seriesTitle
        kavitaMetadata.default.seriesTitleLanguage = config.kavita.metadataUpdate.default.postProcessing.seriesTitleLanguage
        kavitaMetadata.default.languageValue = config.kavita.metadataUpdate.default.postProcessing.languageValue
        kavitaMetadata.default.alternativeTitles = config.kavita.metadataUpdate.default.postProcessing.alternativeSeriesTitles
        kavitaMetadata.default.alternativeTitleLanguages = config.kavita.metadataUpdate.default.postProcessing.alternativeSeriesTitleLanguages

        kavitaMetadata.library = Object.entries(config.kavita.metadataUpdate.library)
            .map(([libraryId, libraryConfig]) => {
                return {
                    id: libraryId,
                    name: libraries.value.find(l => l.id == libraryId)?.name ?? '',
                    deleted: false,
                    aggregateMetadata: libraryConfig.aggregate,
                    modes: libraryConfig.updateModes,
                    bookCovers: libraryConfig.bookCovers,
                    seriesCovers: libraryConfig.seriesCovers,
                    seriesTitle: libraryConfig.postProcessing.seriesTitle,
                    seriesTitleLanguage: libraryConfig.postProcessing.seriesTitleLanguage,
                    languageValue: libraryConfig.postProcessing.languageValue,
                    alternativeTitles: libraryConfig.postProcessing.alternativeSeriesTitles,
                    alternativeTitleLanguages: libraryConfig.postProcessing.alternativeSeriesTitleLanguages
                }
            })
    }

    function getUpdates() {
        let config = currentConfig.value
        if (!config) throw Error('uninitialized config')

        let changes: KomfConfigUpdateDto = {}
        changes.kavita = getKavitaUpdates(config.kavita)
        changes.komga = getKomgaUpdates(config.komga)
        changes.metadataProviders = getMetadataProvidersUpdates()
        changes.discord = getDiscordUpdates(config.discord)
        return changes
    }

    function getKomgaUpdates(current: KomgaConfigDto): KomgaConfigUpdateDto | undefined {
        let changes: KomgaConfigUpdateDto = {}
        if (komga.baseUri != current.baseUri)
            changes.baseUri = komga.baseUri
        if (komga.user != current.komgaUser)
            changes.komgaUser = komga.user
        if (!komga.passwordDisabled && komga.password != '')
            changes.komgaPassword = komga.password

        let eventListenerPatch = {
            enabled: komga.eventListener.enabled,
            libraries: komga.eventListener.libraries?.map(library => library.id) ?? []
        }
        changes.eventListener = getEventListenerUpdates(current.eventListener, eventListenerPatch)
        changes.notifications = getNotificationsUpdates(
            current.notifications,
            {libraries: notifications.komgaLibraries?.map(lib => lib.id) ?? []}
        )
        changes.metadataUpdate = getMetadataUpdates(current.metadataUpdate, komgaMetadata)

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getKavitaUpdates(current: KavitaConfigDto): KavitaConfigUpdateDto | undefined {
        let changes: KavitaConfigUpdateDto = {}
        if (kavita.baseUri != current.baseUri)
            changes.baseUri = kavita.baseUri
        if (kavita.apiKey)
            changes.apiKey = kavita.apiKey

        let eventListenerPatch = {
            enabled: kavita.eventListener.enabled,
            libraries: kavita.eventListener.libraries?.map(library => library.id) ?? []
        }
        changes.eventListener = getEventListenerUpdates(current.eventListener, eventListenerPatch)
        changes.notifications = getNotificationsUpdates(current.notifications,
            {libraries: notifications.kavitaLibraries?.map(lib => lib.id) ?? []}
        )
        changes.metadataUpdate = getMetadataUpdates(current.metadataUpdate, kavitaMetadata)

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getMetadataUpdates(
        current: MetadataUpdateConfigDto,
        patch: { default: ProcessingUpdateModel, library: ProcessingLibraryUpdateModel[] }
    ): MetadataUpdateConfigUpdateDto | undefined {
        let changes: MetadataUpdateConfigUpdateDto = {}
        changes.default = getMetadataProcessingUpdates(current.default, patch.default)
        changes.library = getLibraryMetadataUpdates(current.library, patch.library)

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getMetadataProcessingUpdates(
        current: MetadataProcessingConfigDto | undefined,
        patch: ProcessingUpdateModel
    ): MetadataProcessingConfigUpdateDto | undefined {
        let changes: MetadataProcessingConfigUpdateDto = {}
        if (patch.aggregateMetadata != current?.aggregate)
            changes.aggregate = patch.aggregateMetadata
        if (patch.bookCovers != current?.bookCovers)
            changes.bookCovers = patch.bookCovers
        if (patch.seriesCovers != current?.seriesCovers)
            changes.seriesCovers = patch.seriesCovers
        if (!patch.modes.every((v, i) => v === current?.updateModes[i]))
            changes.updateModes = patch.modes

        let postProcessingChanges: MetadataPostProcessingConfigUpdateDto | undefined = {}
        if (patch.seriesTitle != current?.postProcessing.seriesTitle)
            postProcessingChanges.seriesTitle = patch.seriesTitle
        if (patch.seriesTitleLanguage != current?.postProcessing.seriesTitleLanguage)
            postProcessingChanges.seriesTitleLanguage = patch.seriesTitleLanguage
        if (patch.alternativeTitles != current?.postProcessing.alternativeSeriesTitles)
            postProcessingChanges.alternativeSeriesTitles = patch.alternativeTitles
        if (patch.alternativeTitleLanguages != current?.postProcessing.alternativeSeriesTitleLanguages)
            postProcessingChanges.alternativeSeriesTitleLanguages = patch.alternativeTitleLanguages
        if (patch.orderBooks != current?.postProcessing.orderBooks)
            postProcessingChanges.orderBooks = patch.orderBooks
        if (patch.readingDirectionValue != current?.postProcessing.readingDirectionValue)
            postProcessingChanges.readingDirectionValue = patch.readingDirectionValue
        if (patch.languageValue != current?.postProcessing.languageValue)
            postProcessingChanges.languageValue = patch.languageValue
        if (Object.entries(postProcessingChanges).every(val => val[1] === undefined)) postProcessingChanges = undefined

        changes.postProcessing = postProcessingChanges

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getLibraryMetadataUpdates(
        current: Record<string, MetadataProcessingConfigDto>,
        patch: ProcessingLibraryUpdateModel[]
    ): Record<string, MetadataProcessingConfigUpdateDto | null> | undefined {
        let currentLibrariesConfig = new Map(Object.entries(current ?? {}))
        let updatedLibraryProviders = patch
            .map(libraryConfig => {
                let config: MetadataProcessingConfigUpdateDto | null | undefined
                if (libraryConfig.deleted) config = null
                else config = getMetadataProcessingUpdates(currentLibrariesConfig.get(libraryConfig.id), libraryConfig)

                return [libraryConfig.id, config]
            })
            .filter(val => val[1] !== undefined)

        let changes = Object.fromEntries(updatedLibraryProviders)
        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getEventListenerUpdates(
        current: EventListenerConfigDto,
        patch: EventListenerConfigDto
    ): EventListenerConfigUpdateDto | undefined {
        let changes: EventListenerConfigUpdateDto = {}

        if (patch.enabled != current.enabled)
            changes.enabled = patch.enabled

        if (patch.libraries.length == 0 && current.libraries.length != 0) {
            changes.libraries = []
        } else if (patch.libraries.length != 0 && !patch.libraries.every((v, i) => v === current.libraries[i])) {
            changes.libraries = patch.libraries
        }

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getNotificationsUpdates(
        current: NotificationConfigDto,
        patch: NotificationConfigDto
    ): NotificationConfigUpdateDto | undefined {
        if (patch.libraries.length == 0 && current.libraries.length != 0) {
            return {libraries: []}
        } else if (patch.libraries.length != 0 && !patch.libraries.every((v, i) => v === current.libraries[i])) {
            return patch as NotificationConfigUpdateDto
        } else return undefined
    }

    function getDiscordUpdates(currentConfig: DiscordConfigDto): DiscordConfigUpdateDto | undefined {
        let changes: DiscordConfigUpdateDto = {}
        if (notifications.seriesCover != currentConfig?.seriesCover)
            changes.seriesCover = notifications.seriesCover
        if (notifications.imgurClientId != currentConfig?.imgurClientId)
            changes.imgurClientId = notifications.imgurClientId

        if (JSON.stringify(notifications.webhooks) != JSON.stringify(currentConfig?.webhooks)) {
            let oldEntries = Object.entries(currentConfig?.webhooks ?? {})
                .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                .map(([, value]) => value)


            let webhookChanges = notifications.webhooks.map((obj, index) => {
                return [index, obj.value]
            }).filter(([index, value]) => !(index as number in oldEntries) || oldEntries[index as number] != value)
            if (Object.entries(webhookChanges).filter(val => val[1] != undefined).length != 0)
                changes.webhooks = Object.fromEntries(webhookChanges)
        }

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getMetadataProvidersUpdates(): MetadataProvidersConfigUpdateDto | undefined {
        if (!currentConfig.value) throw Error('uninitialized config')
        let currentProvidersConfig = currentConfig.value?.metadataProviders
        let changes: MetadataProvidersConfigUpdateDto = {}
        if (!metadataProviders.malClientIdDisabled)
            changes.malClientId = metadataProviders.malClientId
        if (metadataProviders.nameMatchingMode != currentProvidersConfig?.nameMatchingMode)
            changes.nameMatchingMode = metadataProviders.nameMatchingMode

        metadataProviders.defaultProviders.forEach((provider, index) => provider.priority = index + 1)
        let updatedProviders = Object.fromEntries(
            metadataProviders.defaultProviders.concat(metadataProviders.defaultDisabledProviders)
                .map(obj => [obj.name, obj as ProviderConfigDto]))
        changes.defaultProviders = getProvidersUpdates(currentProvidersConfig?.defaultProviders, updatedProviders)


        changes.libraryProviders = getLibraryProvidersUpdates()

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getLibraryProvidersUpdates(): Record<string, ProvidersConfigUpdateDto> | undefined {
        let currentLibrariesConfig = new Map(Object.entries(currentConfig.value?.metadataProviders?.libraryProviders ?? {}))
        let updatedLibraryProviders = metadataProviders.libraryProviders
            .map(libraryConfig => {
                libraryConfig.providers.forEach((provider, index) => provider.priority = index + 1)

                let config: ProvidersConfigUpdateDto | null | undefined
                if (libraryConfig.deleted) config = null
                else config = getProvidersUpdates(
                    currentLibrariesConfig.get(libraryConfig.id),
                    Object.fromEntries(libraryConfig.providers.concat(libraryConfig.disabledProviders)
                        .map(provider => [provider.name, provider as ProviderConfigDto])))

                return [libraryConfig.id, config]
            })
            .filter(val => val[1] !== undefined)

        let changes = Object.fromEntries(updatedLibraryProviders)
        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getProvidersUpdates(
        current: ProvidersConfigDto | undefined,
        updated: { [p: string]: ProviderConfigDto }
    ): ProvidersConfigUpdateDto | undefined {
        let changes: ProvidersConfigUpdateDto = {}
        Object.entries(updated).forEach(([key, value]) => {
            switch (key) {
                case 'mangaUpdates':
                    changes.mangaUpdates = getProviderUpdates(current?.mangaUpdates, value)
                    break
                case 'mal':
                    changes.mal = getProviderUpdates(current?.mal, value)
                    break
                case 'nautiljon':
                    changes.nautiljon = getProviderUpdates(current?.nautiljon, value)
                    break
                case 'aniList':
                    changes.aniList = getProviderUpdates(current?.aniList, value)
                    break
                case 'yenPress':
                    changes.yenPress = getProviderUpdates(current?.yenPress, value)
                    break
                case 'kodansha':
                    changes.kodansha = getProviderUpdates(current?.kodansha, value)
                    break
                case 'viz':
                    changes.viz = getProviderUpdates(current?.viz, value)
                    break
                case 'bookWalker':
                    changes.bookWalker = getProviderUpdates(current?.bookWalker, value as ProviderConfigDto)
                    break
                case 'mangaDex':
                    changes.mangaDex = getProviderUpdates(current?.mangaDex, value as ProviderConfigDto)
                    break
                default:
                    throw Error('unknown provider')
            }
        })

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getProviderUpdates(
        current: ProviderConfigDto | undefined,
        updated: ProviderConfigDto
    ): ProviderConfigUpdateDto | undefined {
        let changes: ProviderConfigUpdateDto = {}
        if (updated.enabled != current?.enabled)
            changes.enabled = updated.enabled
        if (updated.priority != current?.priority)
            changes.priority = updated.priority
        if (updated.nameMatchingMode != current?.nameMatchingMode)
            changes.nameMatchingMode = updated.nameMatchingMode
        if (updated.mediaType != current?.mediaType)
            changes.mediaType = updated.mediaType
        changes.seriesMetadata = getSeriesMetadataUpdates(current?.seriesMetadata, updated.seriesMetadata)
        changes.bookMetadata = getBookMetadataUpdates(current?.bookMetadata, updated.bookMetadata)

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getSeriesMetadataUpdates(
        current: SeriesMetadataConfigDto | undefined,
        updated: SeriesMetadataConfigDto
    ): SeriesMetadataConfigUpdateDto | undefined {
        let changes: SeriesMetadataConfigUpdateDto = {}
        if (updated.status != current?.status)
            changes.status = updated.status
        if (updated.title != current?.title)
            changes.title = updated.title
        if (updated.summary != current?.summary)
            changes.summary = updated.summary
        if (updated.publisher != current?.publisher)
            changes.publisher = updated.publisher
        if (updated.readingDirection != current?.readingDirection)
            changes.readingDirection = updated.readingDirection
        if (updated.ageRating != current?.ageRating)
            changes.ageRating = updated.ageRating
        if (updated.language != current?.language)
            changes.language = updated.language
        if (updated.genres != current?.genres)
            changes.genres = updated.genres
        if (updated.tags != current?.tags)
            changes.tags = updated.tags
        if (updated.totalBookCount != current?.totalBookCount)
            changes.totalBookCount = updated.totalBookCount
        if (updated.authors != current?.authors)
            changes.authors = updated.authors
        if (updated.releaseDate != current?.releaseDate)
            changes.releaseDate = updated.releaseDate
        if (updated.thumbnail != current?.thumbnail)
            changes.thumbnail = updated.thumbnail
        if (updated.books != current?.books)
            changes.books = updated.books
        if (updated.links != current?.links)
            changes.links = updated.links
        if (updated.useOriginalPublisher != current?.useOriginalPublisher)
            changes.useOriginalPublisher = updated.useOriginalPublisher
        if (updated.originalPublisherTagName != current?.originalPublisherTagName)
            changes.originalPublisherTagName = updated.originalPublisherTagName
        if (updated.englishPublisherTagName != current?.englishPublisherTagName)
            changes.englishPublisherTagName = updated.englishPublisherTagName
        if (updated.frenchPublisherTagName != current?.frenchPublisherTagName)
            changes.frenchPublisherTagName = updated.frenchPublisherTagName

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getBookMetadataUpdates(
        current: BookMetadataConfigDto | undefined,
        updated: BookMetadataConfigDto
    ): BookMetadataConfigUpdateDto | undefined {
        let changes: BookMetadataConfigUpdateDto = {}

        if (updated.title != current?.title)
            changes.title = updated.title
        if (updated.summary != current?.summary)
            changes.summary = updated.summary
        if (updated.number != current?.number)
            changes.number = updated.number
        if (updated.releaseDate != current?.releaseDate)
            changes.releaseDate = updated.releaseDate
        if (updated.authors != current?.authors)
            changes.authors = updated.authors
        if (updated.tags != current?.tags)
            changes.tags = updated.tags
        if (updated.isbn != current?.isbn)
            changes.isbn = updated.isbn
        if (updated.links != current?.links)
            changes.links = updated.links
        if (updated.thumbnail != current?.thumbnail)
            changes.thumbnail = updated.thumbnail

        if (Object.entries(changes).every(val => val[1] === undefined)) return undefined
        else return changes
    }

    function getLibraries() {
        if (settings.mediaServer == MediaServer.Komga) {
            return Array.from(document.getElementsByClassName('v-navigation-drawer__content')[0]
                .getElementsByTagName('a'))
                .filter(el => el.classList.contains('v-list-item--dense') &&
                    /\/libraries.*/.test(el.getAttribute('href')!)
                ).map(el => {
                    return {
                        id: el.getAttribute('href')!.split('/')[2],
                        name: el.text
                    }
                })
        } else {
            return Array.from(document.getElementsByTagName('app-side-nav')[0]
                .getElementsByTagName('a'))
                .filter(el => el.classList.contains('side-nav-item') &&
                    /\/library.*/.test(el.getAttribute('href')!)
                ).map(el => {
                    return {
                        id: el.getAttribute('href')!.split('/')[2],
                        name: Array.from(el.getElementsByTagName('span'))
                            .find(span => span.classList.contains('side-nav-text'))?.textContent ?? ''
                    }
                })
        }
    }

    return {
        currentConfig,
        notifications,
        metadataProviders,
        komgaMetadata,
        kavitaMetadata,
        libraries,
        providersWithBooks,
        providersWithMediaType,
        kavita,
        komga,
        reset,
        getUpdates,
    }
})

export interface ProcessingUpdateModel {
    aggregateMetadata: boolean,
    modes: string[],
    seriesTitle: boolean,
    seriesTitleLanguage: string,
    alternativeTitles: boolean,
    alternativeTitleLanguages: string[],
    bookCovers: boolean,
    seriesCovers: boolean,
    orderBooks?: boolean,
    readingDirectionValue?: null | string,
    languageValue?: null | string,
}

export interface ProcessingLibraryUpdateModel extends ProcessingUpdateModel {
    id: string,
    name: string,
    deleted: boolean,
}

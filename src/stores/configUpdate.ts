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
    const providersWithBooks = ['nautiljon', 'yenPress', 'kodansha', 'viz', 'bookWalker']

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
            ...new DefaultProviderConfig() as ProviderConfigDto
        }],

        defaultDisabledProviders: [{
            name: 'MangaUpdates',
            books: false,
            ...new DefaultProviderConfig() as ProviderConfigDto
        }],
        libraryProviders: [{
            id: '123',
            name: '',
            deleted: false,
            providers: [{
                name: 'MangaUpdates',
                books: false,
                ...new DefaultProviderConfig() as ProviderConfigDto
            }],
            disabledProviders: [{
                name: 'MangaUpdates',
                books: false,
                ...new DefaultProviderConfig() as ProviderConfigDto
            }]
        }]
    })

    const komgaMetadata = reactive({
        aggregateMetadata: false,
        modes: ['API'],
        bookThumbnails: false,
        seriesThumbnails: false,
        seriesTitle: false,
        titleType: 'LOCALIZED',
        orderBooks: false,
        readingDirectionValue: null,
        languageValue: null,
    } as ProcessingUpdateModel)

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
        baseUri: 'http://localhost:8080',
        apiKey: '',
        eventListener: {
            enabled: false,
            libraries: [] as { name: string | undefined, id: string }[] | null
        }
    })
    const kavitaMetadata = reactive({
        aggregateMetadata: false,
        modes: ['API'],
        bookThumbnails: false,
        seriesThumbnails: false,
        seriesTitle: false,
        titleType: 'LOCALIZED',
        languageValue: null,
    } as ProcessingUpdateModel)

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
            .map(([key, value]) => {
                let books = providersWithBooks.includes(key)
                return {...(value as ProviderConfigDto), name: key, books: books}
            }).filter(provider => provider.enabled)

        metadataProviders.defaultDisabledProviders = Object.entries(config.metadataProviders.defaultProviders)
            .map(([key, value]) => {
                let books = providersWithBooks.includes(key)
                return {...(value as ProviderConfigDto), name: key, books: books}
            }).filter(provider => !provider.enabled)
            .sort((a, b) => a.name.localeCompare(b.name))

        metadataProviders.libraryProviders = Object.entries(config.metadataProviders.libraryProviders)
            .map(([key, value]) => {
                return {
                    id: key,
                    name: libraries.value.find(l => l.id == key)?.name ?? '',
                    deleted: false,
                    providers: Object.entries(value as ProvidersConfigDto).map(([key, value]) => {
                        let books = providersWithBooks.includes(key)
                        return {...value as ProviderConfigDto, name: key, books: books}
                    }).filter(provider => provider.enabled),
                    disabledProviders: Object.entries(value as ProvidersConfigDto).map(([key, value]) => {
                        let books = providersWithBooks.includes(key)
                        return {...value as ProviderConfigDto, name: key, books: books}
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

        komgaMetadata.aggregateMetadata = config.komga.aggregateMetadata
        komgaMetadata.modes = config.komga.metadataUpdate.modes.slice()
        komgaMetadata.bookThumbnails = config.komga.metadataUpdate.bookThumbnails
        komgaMetadata.seriesThumbnails = config.komga.metadataUpdate.seriesThumbnails
        komgaMetadata.seriesTitle = config.komga.metadataUpdate.seriesTitle
        komgaMetadata.orderBooks = config.komga.metadataUpdate.orderBooks
        komgaMetadata.readingDirectionValue = config.komga.metadataUpdate.readingDirectionValue
        komgaMetadata.languageValue = config.komga.metadataUpdate.languageValue

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

        kavitaMetadata.aggregateMetadata = config.kavita.aggregateMetadata
        kavitaMetadata.modes = config.kavita.metadataUpdate.modes.slice()
        kavitaMetadata.bookThumbnails = config.kavita.metadataUpdate.bookThumbnails
        kavitaMetadata.seriesThumbnails = config.kavita.metadataUpdate.seriesThumbnails
        kavitaMetadata.seriesTitle = config.kavita.metadataUpdate.seriesTitle
        kavitaMetadata.languageValue = config.kavita.metadataUpdate.languageValue
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

    function getKomgaUpdates(current: KomgaConfigDto) {
        let changes: KomgaConfigUpdateDto = {}
        if (komga.baseUri != current.baseUri)
            changes.baseUri = komga.baseUri
        if (komga.user != current.komgaUser)
            changes.komgaUser = komga.user
        if (!komga.passwordDisabled && komga.password != '')
            changes.komgaPassword = komga.password
        if (komgaMetadata.aggregateMetadata != current.aggregateMetadata)
            changes.aggregateMetadata = komgaMetadata.aggregateMetadata

        let eventListenerPatch = {
            enabled: komga.eventListener.enabled,
            libraries: komga.eventListener.libraries?.map(library => library.id) ?? []
        }
        changes.eventListener = getEventListenerUpdates(current.eventListener, eventListenerPatch)
        changes.notifications = getNotificationsUpdates(
            current.notifications,
            {libraries: notifications.komgaLibraries?.map(lib => lib.id) ?? []}
        )
        changes.metadataUpdate = getMetadataUpdates(current.metadataUpdate, komgaMetadata as MetadataUpdateConfigDto)

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getKavitaUpdates(current: KavitaConfigDto) {
        let changes: KavitaConfigUpdateDto = {}
        if (kavita.baseUri != current.baseUri)
            changes.baseUri = komga.baseUri
        if (kavita.apiKey)
            changes.apiKey = kavita.apiKey
        if (kavitaMetadata.aggregateMetadata != current.aggregateMetadata)
            changes.aggregateMetadata = kavitaMetadata.aggregateMetadata

        let eventListenerPatch = {
            enabled: kavita.eventListener.enabled,
            libraries: kavita.eventListener.libraries?.map(library => library.id) ?? []
        }
        changes.eventListener = getEventListenerUpdates(current.eventListener, eventListenerPatch)
        changes.notifications = getNotificationsUpdates(current.notifications,
            {libraries: notifications.kavitaLibraries?.map(lib => lib.id) ?? []}
        )
        changes.metadataUpdate = getMetadataUpdates(current.metadataUpdate, kavitaMetadata as MetadataUpdateConfigDto)

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getMetadataUpdates(current: MetadataUpdateConfigDto, patch: MetadataUpdateConfigDto) {
        let changes: MetadataUpdateConfigUpdateDto = {}
        if (!patch.modes.every((v, i) => v === current.modes[i]))
            changes.modes = patch.modes
        if (patch.bookThumbnails != current.bookThumbnails)
            changes.bookThumbnails = patch.bookThumbnails
        if (patch.seriesThumbnails != current.seriesThumbnails)
            changes.seriesThumbnails = patch.seriesThumbnails
        if (patch.seriesTitle != current.seriesTitle)
            changes.seriesTitle = patch.seriesTitle
        if (patch.titleType != current.titleType)
            changes.titleType = patch.titleType
        if (patch.orderBooks != current.orderBooks)
            changes.orderBooks = patch.orderBooks
        if (patch.readingDirectionValue != current.readingDirectionValue)
            changes.readingDirectionValue = patch.readingDirectionValue
        if (patch.languageValue != patch.languageValue)
            changes.languageValue = patch.languageValue

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getEventListenerUpdates(current: EventListenerConfigDto, patch: EventListenerConfigDto) {
        let changes: EventListenerConfigUpdateDto = {}

        if (patch.enabled != current.enabled)
            changes.enabled = komga.eventListener.enabled

        if (patch.libraries == null) {
            changes.libraries = []
        } else if (!patch.libraries.every((v, i) => v === current.libraries[i])) {
            changes.libraries = patch.libraries
        }

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getNotificationsUpdates(current: NotificationConfigDto, patch: NotificationConfigDto) {
        if (patch.libraries.length == 0) {
            return {libraries: []}
        } else if (!patch.libraries.every((v, i) => v === current.libraries[i])) {
            return patch as NotificationConfigUpdateDto
        } else return undefined
    }

    function getDiscordUpdates(currentConfig: DiscordConfigDto) {
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

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getMetadataProvidersUpdates() {
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

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getLibraryProvidersUpdates() {
        let currentLibrariesConfig = new Map(Object.entries(currentConfig.value?.metadataProviders?.libraryProviders ?? {}))
        let updatedLibraryProviders = metadataProviders.libraryProviders
            .map(libraryConfig => {
                let config
                if (libraryConfig.deleted) config = null
                else config = getProvidersUpdates(
                    currentLibrariesConfig.get(libraryConfig.id),
                    Object.fromEntries(libraryConfig.providers.concat(libraryConfig.disabledProviders)
                        .map(provider => [provider.name, provider as ProviderConfigDto])))

                return [libraryConfig.id, config]
            })
            .filter(val => val[1] !== undefined)

        let changes = Object.fromEntries(updatedLibraryProviders)
        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getProvidersUpdates(current: ProvidersConfigDto | undefined, updated: { [p: string]: ProviderConfigDto }) {
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
                default:
                    throw Error('unknown provider')
            }
        })

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getProviderUpdates(current: ProviderConfigDto | undefined, updated: ProviderConfigDto) {
        let changes: ProviderConfigUpdateDto = {}
        if (updated.enabled != current?.enabled)
            changes.enabled = updated.enabled
        if (updated.priority != current?.priority)
            changes.priority = updated.priority
        if (updated.nameMatchingMode != current?.nameMatchingMode)
            changes.nameMatchingMode = updated.nameMatchingMode
        if (updated.nameMatchingMode != current?.nameMatchingMode)
            changes.nameMatchingMode = updated.nameMatchingMode
        changes.seriesMetadata = getSeriesMetadataUpdates(current?.seriesMetadata, updated.seriesMetadata)
        changes.bookMetadata = getBookMetadataUpdates(current?.bookMetadata, updated.bookMetadata)

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getSeriesMetadataUpdates(current: SeriesMetadataConfigDto | undefined, updated: SeriesMetadataConfigDto) {
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
        if (updated.useOriginalPublisher != current?.useOriginalPublisher)
            changes.useOriginalPublisher = updated.useOriginalPublisher
        if (updated.originalPublisherTagName != current?.originalPublisherTagName)
            changes.originalPublisherTagName = updated.originalPublisherTagName
        if (updated.englishPublisherTagName != current?.englishPublisherTagName)
            changes.englishPublisherTagName = updated.englishPublisherTagName
        if (updated.frenchPublisherTagName != current?.frenchPublisherTagName)
            changes.frenchPublisherTagName = updated.frenchPublisherTagName

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
        else return changes
    }

    function getBookMetadataUpdates(current: BookMetadataConfigDto | undefined, updated: BookMetadataConfigDto) {
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

        if (Object.entries(changes).every(val => val[1] == undefined)) return undefined
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
        kavita,
        komga,
        reset,
        getUpdates,
    }
})

export interface ProcessingUpdateModel {
    aggregateMetadata: boolean,
    modes: string[],
    bookThumbnails: boolean,
    seriesThumbnails: boolean,
    seriesTitle: boolean,
    titleType: string,
    orderBooks?: boolean,
    readingDirectionValue?: null | string,
    languageValue?: null | string,
}

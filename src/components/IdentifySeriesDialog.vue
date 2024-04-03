<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="loading" @keyup.enter="handleEnterKeyPress">
    <q-card class="q-dialog-plugin" style="max-width: 820px; width: 820px">
      <q-card-section>

        <div class="text-h6 gt-xs q-pb-lg">
          <q-icon :name="settings.mediaServer === MediaServer.Komga?
           'mdi-pencil' :'fa fa-pen'"
          />
          Identify
        </div>

        <q-card flat v-if="search">

          <q-toolbar class="lt-sm" id="identify_toolbar">
            <q-btn flat icon="mdi-close" @click="onDialogCancel" />
            <q-toolbar-title>Identify</q-toolbar-title>
            <q-space />
            <q-btn color="secondary" :loading="loading" :disable="loading || form.title === ''" @click="searchSeries">
              Search
            </q-btn>
          </q-toolbar>


          <div class="col">
            <q-input class="q-pt-sm q-pb-sm" v-model="form.title" label="title" filled />
            <q-input class="q-pt-sm q-pb-sm" v-model="form.edition" label="edition" filled />
          </div>

          <q-card-actions align="right" class="gt-xs q-pt-lg q-pb-sm">
            <q-btn :disable="loading" @click="onDialogCancel">Cancel</q-btn>
            <q-btn :loading="loading" :disable="loading || form.title === ''" color="secondary" @click="searchSeries">
              Search
            </q-btn>
          </q-card-actions>
        </q-card>

        <q-card flat v-if="results">

          <q-toolbar class="lt-sm">
            <q-btn flat icon="mdi-close" @click="onDialogCancel">
            </q-btn>
            <q-toolbar-title>Identify</q-toolbar-title>
            <q-space />
            <q-btn color="secondary" :disable="!selected" @click="dialogConfirm">Confirm</q-btn>
          </q-toolbar>

          <div class="row">
            <div class="col-auto"
                 style="padding: 16px 16px 16px 16px;"
                 v-for="(item, index) in searchResults"
                 :key="index"
            >
              <identify-card :item="item" :selected="isResultSelected(item)" @on-select-result="selectResult" />
            </div>
          </div>
          <q-card-actions align="right" class="gt-xs q-pt-lg q-pb-sm" v-if="results">
            <q-btn flat :disable="loading" @click="onDialogCancel">Cancel</q-btn>
            <q-btn color="secondary" :disable="!selected || loading" :loading="loading" @click="dialogConfirm">Confirm
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue'
import type { IdentifyRequest, SearchResult } from '@/types/metadata'
import IdentifyCard from '@/components/IdentifyCard.vue'
import type KomfMetadataService from '../services/komf-metadata.service'
import { komfMetadataKey } from '@/injection-keys'
import { useSettingsStore } from '@/stores/settings'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { errorNotification } from '@/errorNotification'
import MediaServer from '@/types/mediaServer'

defineEmits([
    ...useDialogPluginComponent.emits
])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const metadataService = inject<KomfMetadataService>(
    komfMetadataKey
) as KomfMetadataService

const props = defineProps({
    seriesTitle: {
        type: String
    }
})

const $q = useQuasar()
const settings = useSettingsStore()

const search = ref(true)
const results = ref(false)
const loading = ref(false)
const selected = ref(false)
const form = reactive({ title: props.seriesTitle ?? '', edition: '' })
const edition = ref('')
const searchResults = ref<SearchResult[]>()
const selectedResult = ref<SearchResult>({} as SearchResult)

const seriesId = computed(() => {
    let path = window.location.pathname.split('/')
    return path[path.findIndex(el => el == 'series' || el == 'oneshot') + 1]
})

const libraryId = computed(() => {
    if (settings.mediaServer == MediaServer.Komga) {
        return Array.from(document.querySelector('.v-main__wrap .v-toolbar__content')?.children ?? [])
            .find(el => {
                let link = el.getAttribute('href')
                if (!link) return false
                return /\/libraries.*/.test(link)
            })?.getAttribute('href')!.split('/')[2]
    } else {
        let pathTokens = window.location.pathname.split('/')
        if (pathTokens[1] == 'library') {
            return pathTokens[2]
        } else {
            return undefined
        }
    }
})

async function dialogConfirm() {
    loading.value = true
    await editMetadata()
    onDialogOK()
}

async function searchSeries() {
    loading.value = true
    try {
        searchResults.value = await metadataService.searchSeries(form.title, libraryId.value, seriesId.value)
    } catch (e) {
        errorNotification(e, $q)
        onDialogCancel()
        return
    }
    results.value = true
    search.value = false
    loading.value = false
    edition.value = form.edition
}

async function editMetadata() {
    if (seriesId.value) {
        const request: IdentifyRequest = {
            libraryId: libraryId.value,
            seriesId: seriesId.value,
            provider: selectedResult.value.provider,
            providerSeriesId: selectedResult.value.resultId,
            edition: edition.value == '' ? undefined : edition.value
        }

        try {
            await metadataService.identifySeries(request)
        } catch (e) {
            errorNotification(e, $q)
            onDialogCancel()
            return
        }
    }
}

function selectResult(searchResult: SearchResult) {
    selectedResult.value = searchResult
    selected.value = true
}

function isResultSelected(item: SearchResult): boolean {
    return selectedResult.value === item
}

function handleEnterKeyPress() {
    if (search.value && !loading.value && form.title) {
        searchSeries()
    }
}
</script>

<style scoped lang="scss">
@import '../styles/scoped.scss';
</style>

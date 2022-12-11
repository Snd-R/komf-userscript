<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" :persistent="loading">
    <q-card class="q-dialog-plugin" style="max-width: 800px; width: 800px">
      <q-card-section>

        <div class="text-h6 gt-xs q-pb-lg">
          <q-icon name="mdi-pencil"/>
          Identify
        </div>

        <q-card flat v-if="search">

          <q-toolbar class="lt-sm" id="identify_toolbar">
            <q-btn flat icon="mdi-close" @click="onDialogCancel"/>
            <q-toolbar-title>Identify</q-toolbar-title>
            <q-space/>
            <q-btn color="secondary" :loading="loading" :disable="loading || form.title === ''" @click="searchSeries">
              Search
            </q-btn>
          </q-toolbar>


          <div class="col">
            <q-input class="q-pt-sm q-pb-sm" v-model="form.title" label="title" filled/>
            <q-input class="q-pt-sm q-pb-sm" v-model="form.edition" label="edition" filled/>
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
            <q-space/>
            <q-btn color="secondary" :disable="!selected" @click="dialogConfirm">Confirm</q-btn>
          </q-toolbar>

          <div class="row">
            <div class="col-auto" v-for="(item, index) in searchResults" :key="index">
              <identify-card :item="item" :selected="isResultSelected(item)" @on-select-result="selectResult"/>
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
import {computed, inject, reactive, ref} from 'vue'
import type {IdentifyRequest, SearchResult} from '@/types/metadata'
import IdentifyCard from '@/components/IdentifyCard.vue'
import type KomfMetadataService from '../services/komf-metadata.service'
import {komfMetadataKey} from '@/injection-keys'
import {useDialogPluginComponent} from 'quasar'
import {errorNotification} from '@/errorNotification'
import {useQuasar} from 'quasar'

defineEmits([
  ...useDialogPluginComponent.emits
])
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()

const metadataService = inject<KomfMetadataService>(
    komfMetadataKey
) as KomfMetadataService

const props = defineProps({
  seriesTitle: {
    type: String,
  },
})

const $q = useQuasar()
const search = ref(true)
const results = ref(false)
const loading = ref(false)
const selected = ref(false)
const form = reactive({title: props.seriesTitle ?? '', edition: ''})
const edition = ref('')
const searchResults = ref<SearchResult[]>()
const selectedResult = ref<SearchResult>({} as SearchResult)

const seriesId = computed(() => {
  const pathNameArray = window.location.pathname.split('/') || ['']
  let seriesId = pathNameArray.pop()
  if (seriesId === '') {
    seriesId = pathNameArray.pop()
  }

  return seriesId
})

async function dialogConfirm() {
  loading.value = true
  await editMetadata()
  onDialogOK()
}

async function searchSeries() {
  loading.value = true
  try {
    searchResults.value = await metadataService.searchSeries(form.title)
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
      seriesId: seriesId.value,
      provider: selectedResult.value.provider,
      providerSeriesId: selectedResult.value.resultId,
      edition: edition.value == '' ? undefined : edition.value,
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
</script>

<style scoped lang="scss">
@import '../styles/fixed.scss';
</style>

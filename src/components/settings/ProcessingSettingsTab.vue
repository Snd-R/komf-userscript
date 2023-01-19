<template>
  <div class="column">
    <div class="text-h6 gt-xs q-pb-lg">
      <q-icon :name="settings.mediaServer === MediaServer.Komga?
                      'mdi-file-refresh' :'fa fa-file-code'"/>
      Metadata Processing
    </div>

    <div class="col-auto">
      <q-checkbox v-model="model.aggregateMetadata" label="Aggregate from all providers"/>
    </div>

    <div class="col-auto" style="padding: 8px 0 0 0">
      <div class="row">
        <div class="col-auto">
          <q-checkbox v-model="model.seriesThumbnails" label="Series Cover"/>
        </div>

        <div class="col-auto">
          <q-checkbox v-model="model.bookThumbnails" label="Book Cover"/>
        </div>
      </div>
    </div>

    <div class="col-auto" style="padding: 8px 0 0 0">
      <div class="row">
        <div class="col-auto">
          <q-checkbox v-model="model.seriesTitle" label="Series Title"/>
        </div>
        <div class="col-auto" style="width: 200px; padding: 0 0 0 16px">
          <q-select
              filled
              dense
              v-model="model.titleType"
              :options="titleOptions"
              label="Title Type"
              dropdown-icon="mdi-menu-down"/>
        </div>
      </div>
    </div>

    <div v-if="settings.mediaServer === MediaServer.Komga"
         class="col-auto"
         style="padding: 8px 0 0 0">
      <q-checkbox v-model="model.orderBooks" label="Order Books"/>
    </div>

    <div class="col-auto" style="width: 200px; padding: 8px 0 0 0">
      <q-select
          filled
          dense
          v-model="model.modes"
          multiple
          :options="updateModeOptions"
          label="Update modes"
          dropdown-icon="mdi-menu-down"
      />
    </div>

    <div class="col-auto" style="padding: 8px 0 0 0">
      <div class="row">
        <div v-if="settings.mediaServer === MediaServer.Komga" class="col-auto"
             style="width: 200px; margin: 0 16px 0 0">
          <q-select
              filled
              dense
              v-model="model.readingDirectionValue"
              :options="readingDirectionOptions"
              label="Default Reading Direction"
              dropdown-icon="mdi-menu-down"
          />
        </div>

        <div class="col-auto" style="width: 200px">
          <q-input
              v-model="model.languageValue"
              label="Series Default Language"
              dense
              filled
              hint="IETF BCP 47 language tag"
              hide-hint
              :rules="[val => val==='' || val===null || isLangCode(val).res]"
          />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import {useSettingsStore} from '@/stores/settings'
import {useConfigUpdateStore} from "@/stores/configUpdate";
import {isLangCode} from "is-language-code";
import MediaServer from "@/types/mediaServer";
import {QInput} from "quasar";

const settings = useSettingsStore()
let config = useConfigUpdateStore()

const updateModeOptions = ['API', 'COMIC_INFO']
const titleOptions = ['LOCALIZED', 'ROMAJI', 'NATIVE']
const readingDirectionOptions = ['LEFT_TO_RIGHT', 'RIGHT_TO_LEFT', 'VERTICAL', 'WEBTOON']
const model = settings.mediaServer === MediaServer.Kavita
    ? config.kavitaMetadata
    : config.komgaMetadata

</script>

<style scoped lang="scss">
@import '../../styles/scoped.scss';
</style>

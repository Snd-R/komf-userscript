<template>
  <q-tabs
      v-model="tab"
      dense
      class="text-grey"
      active-color="primary"
      indicator-color="primary"
      align="justify"
      narrow-indicator
      :key="tabsKey"
  >
    <q-tab name="default" label="Default" no-caps/>
    <template v-for="(library,index) in model.library" :key="library.id">
      <q-tab :name="library.id" v-if="!library.deleted" no-caps>
        <div>
          {{ `${library.name} (${library.id})` }}
          <q-btn flat
                 size="xs"
                 :icon-right="settings.mediaServer === MediaServer.Komga? 'mdi-close' :'fa fa-xmark'"
                 @click="removeLibrary(index)"
          >
          </q-btn>
        </div>
      </q-tab>

    </template>
    <q-btn
        v-if="getLibraries().length"
        flat>
      <div class="col-auto">
        Library
      </div>
      <div class="col-auto q-ml-sm">
        <q-icon :name="settings.mediaServer === MediaServer.Komga? 'mdi-plus' :'fa fa-plus'"/>
      </div>

      <q-menu fit>
        <q-list dense v-for="(library,index) in getLibraries()">
          <q-item clickable v-close-popup @click="addLibrary(library.id)">
            <q-item-section>
              <q-item-label>{{ library.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

      </q-menu>
    </q-btn>

  </q-tabs>

  <q-separator/>

  <q-tab-panels v-model="tab" ref="tabPanel" animated>
    <q-tab-panel name="default" style="padding: 8px 0 0 0">
      <div class="column">
        <div class="col-auto">
          <q-checkbox v-model="model.default.aggregateMetadata" label="Aggregate from all providers"/>
        </div>

        <div class="col-auto" style="padding: 8px 0 0 0">
          <div class="row">
            <div class="col-auto">
              <q-checkbox v-model="model.default.seriesCovers" label="Series Cover"/>
            </div>

            <div class="col-auto">
              <q-checkbox v-model="model.default.bookCovers" label="Book Cover"/>
            </div>
          </div>
        </div>

        <div class="col-auto" style="padding: 8px 0 0 0">
          <div class="row">
            <div class="col-auto">
              <q-checkbox v-model="model.default.seriesTitle" label="Series Title"/>
            </div>
            <div class="col-auto" style="width: 200px; padding: 0 0 0 16px">
              <q-select
                  filled
                  dense
                  v-model="model.default.titleType"
                  :options="titleOptions"
                  label="Title Type"
                  dropdown-icon="mdi-menu-down"/>
            </div>
          </div>
        </div>

        <div class="col-auto" style="padding: 8px 0 0 0">
          <q-checkbox v-model="model.default.alternativeTitles" label="Alternative Series Titles"/>
        </div>

        <div v-if="settings.mediaServer === MediaServer.Komga"
             class="col-auto"
             style="padding: 8px 0 0 0">
          <q-checkbox v-model="model.default.orderBooks" label="Order Books"/>
        </div>

        <div class="col-auto" style="width: 200px; padding: 8px 0 0 0">
          <q-select
              filled
              dense
              v-model="model.default.modes"
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
                  v-model="model.default.readingDirectionValue"
                  :options="readingDirectionOptions"
                  label="Default Reading Direction"
                  dropdown-icon="mdi-menu-down"
              />
            </div>

            <div class="col-auto" style="width: 200px">
              <q-input
                  v-model="model.default.languageValue"
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
    </q-tab-panel>

    <template v-for="(library,libraryIndex) in model.library" :key="library.id">
      <q-tab-panel :name="library.id" v-if="!library.deleted" style="padding: 8px 0 0 0">
        <div class="column">
          <div class="col-auto">
            <q-checkbox v-model="model.library[libraryIndex].aggregateMetadata" label="Aggregate from all providers"/>
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <div class="row">
              <div class="col-auto">
                <q-checkbox v-model="model.library[libraryIndex].seriesCovers" label="Series Cover"/>
              </div>

              <div class="col-auto">
                <q-checkbox v-model="model.library[libraryIndex].bookCovers" label="Book Cover"/>
              </div>
            </div>
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <div class="row">
              <div class="col-auto">
                <q-checkbox v-model="model.library[libraryIndex].seriesTitle" label="Series Title"/>
              </div>
              <div class="col-auto" style="width: 200px; padding: 0 0 0 16px">
                <q-select
                    filled
                    dense
                    v-model="model.library[libraryIndex].titleType"
                    :options="titleOptions"
                    label="Title Type"
                    dropdown-icon="mdi-menu-down"/>
              </div>
            </div>
          </div>

          <div class="col-auto" style="padding: 8px 0 0 0">
            <q-checkbox v-model="model.library[libraryIndex].alternativeTitles" label="Alternative Series Titles"/>
          </div>

          <div v-if="settings.mediaServer === MediaServer.Komga"
               class="col-auto"
               style="padding: 8px 0 0 0">
            <q-checkbox v-model="model.library[libraryIndex].orderBooks" label="Order Books"/>
          </div>

          <div class="col-auto" style="width: 200px; padding: 8px 0 0 0">
            <q-select
                filled
                dense
                v-model="model.library[libraryIndex].modes"
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
                    v-model="model.library[libraryIndex].readingDirectionValue"
                    :options="readingDirectionOptions"
                    label="Default Reading Direction"
                    dropdown-icon="mdi-menu-down"
                />
              </div>

              <div class="col-auto" style="width: 200px">
                <q-input
                    v-model="model.library[libraryIndex].languageValue"
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
      </q-tab-panel>
    </template>
  </q-tab-panels>
</template>

<script setup lang="ts">
import {useSettingsStore} from '@/stores/settings'
import {useConfigUpdateStore} from "@/stores/configUpdate";
import {isLangCode} from "is-language-code";
import MediaServer from "@/types/mediaServer";
import {QInput, QTabPanels} from "quasar";
import {computed, nextTick, ref} from "vue";

const settings = useSettingsStore()
let config = useConfigUpdateStore()


const updateModeOptions = ['API', 'COMIC_INFO']
const titleOptions = ['LOCALIZED', 'ROMAJI', 'NATIVE']
const readingDirectionOptions = ['LEFT_TO_RIGHT', 'RIGHT_TO_LEFT', 'VERTICAL', 'WEBTOON']
const model = settings.mediaServer === MediaServer.Kavita
    ? config.kavitaMetadata
    : config.komgaMetadata

const tab = ref('default')
const tabsKey = computed(() => model.library.map(p => p.deleted).join())
const tabPanel = ref<InstanceType<typeof QTabPanels> | null>(null)

async function addLibrary(id: string) {
  let existing = model.library.find(library => library.id == id)
  if (existing) {
    existing.deleted = false
    await nextTick()
    tabPanel.value?.goTo(id)
    return
  }
  model.library.push({
    id: id,
    name: config.libraries.find(l => l.id == id)?.name ?? '',
    deleted: false,

    aggregateMetadata: false,
    modes: ['API'],
    bookCovers: false,
    seriesCovers: false,
    seriesTitle: false,
    titleType: 'LOCALIZED',
    alternativeTitles: false,
    orderBooks: false,
    readingDirectionValue: null,
    languageValue: null,
  })

  await nextTick()
  tabPanel.value?.goTo(id)
}

function removeLibrary(index: number) {
  model.library[index].deleted = true
  tabPanel.value?.goTo('default')
}

function getLibraries() {
  let libraryConfigs = model.library
  return config.libraries.filter(library => !libraryConfigs.find(conf => !conf.deleted && conf.id == library.id))
}

</script>

<style scoped lang="scss">
@import '../../styles/scoped.scss';
</style>

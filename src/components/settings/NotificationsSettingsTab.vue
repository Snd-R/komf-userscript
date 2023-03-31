<template>
  <div class="column">
    <div class="text-h6 gt-xs q-pb-lg">
      <q-icon :name="settings.mediaServer === MediaServer.Komga?
                      'mdi-bell' :'fa fa-bell'"/>
      Discord Notifications
    </div>

    <div v-if="settings.mediaServer === MediaServer.Komga" class="col-auto" style="padding: 8px 0 8px 0">
      <q-select
          filled
          v-model=" config.komgaLibraries"
          multiple
          clearable
          :options="configStore.libraries"
          :option-label="libraryLabel"
          label="Notify for Libraries"
          hint="will notify for all libraries if empty"
      />
    </div>

    <div v-if="settings.mediaServer === MediaServer.Kavita" class="col-auto" style="padding: 8px 0 8px 0">
      <q-select
          filled
          v-model=" config.kavitaLibraries"
          multiple
          clearable
          :options="configStore.libraries"
          :option-label="libraryLabel"
          label="Notify for Libraries"
          hint="will notify for all libraries if empty"
      />
    </div>

    <q-separator/>

    <div class="col-auto">
      <q-checkbox v-model="config.seriesCover" label="Upload Series Cover"/>
    </div>

    <div class="col-auto" style="padding: 8px 0 0 0">
      <span class="text-body2">Webhooks</span>
      <template v-for="(webhook,i) in config.webhooks">
        <div class="row q-pt-sm" v-if="webhook.value!=null">
          <div class="col">
            <q-input
                v-model="config.webhooks[i].value"
                autogrow
                filled
                :disable="config.webhooks[i].existing"
            >
            </q-input>
          </div>

          <div class="col-auto">
            <q-btn
                @click="removeEntry(i)"
                flat
                round
                :icon="settings.mediaServer === MediaServer.Komga? 'mdi-delete' :'fa fa-trash'"
                :size="settings.mediaServer === MediaServer.Komga? 'md':'sm'"
            />
          </div>
        </div>
      </template>
    </div>

    <div class="col-auto" style="padding: 8px 0 0 0">
      <div class="row">
        <q-space/>
        <q-btn
            round
            color="secondary"
            @click="addEntry"
            :icon="settings.mediaServer === MediaServer.Komga? 'mdi-plus' :'fa fa-plus'"
            style="padding: 0"/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {useSettingsStore} from '@/stores/settings'
import MediaServer from "@/types/mediaServer";
import {useConfigUpdateStore} from "@/stores/configUpdate";

const settings = useSettingsStore()
const configStore = useConfigUpdateStore()
let config = configStore.notifications

function addEntry() {
  config.webhooks.push({value: '', existing: false})
}

function removeEntry(index: number) {
  let webhook = config.webhooks[index]
  if (webhook.existing)
    webhook.value = null
  else config.webhooks.splice(index, 1)
}

function libraryLabel(library: { name: string | null, id: string }) {
  return `${library.name} (${library.id})`
}
</script>

<style scoped lang="scss">
@import '../../styles/scoped.scss';
</style>

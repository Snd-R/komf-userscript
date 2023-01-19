<template>
  <div class="column">
    <div class="text-h6 gt-xs q-pb-lg">
      <q-icon name="fa fa-server"/>
      Kavita
    </div>
    <div class="col-auto">
      <q-input
          v-model="config.baseUri"
          label="Base Uri"
          filled
      />
    </div>

    <div class="col-auto" style="padding: 8px 0 0 0">
      <div class="row">
        <div class="col" style="padding: 0">
          <q-input
              v-model="config.apiKey"
              label="Api Key"
              filled
              :disable="apiKeyDisabled"
          />
        </div>

        <div class="col-auto" v-if="apiKeyDisabled" style="padding: 0">
          <q-btn
              @click="config.apiKey=''; apiKeyDisabled = false"
              flat
              round
              icon="fa fa-pencil"
              size="sm"
          />
        </div>

      </div>
    </div>
    <span class="text-body2 q-pt-sm">Event Listener</span>
    <div class="col-auto">

      <q-checkbox v-model="config.eventListener.enabled"
                  label="Enable Event Listener"/>
    </div>

    <div class="col-auto">
      <q-select
          filled
          v-model="config.eventListener.libraries"
          multiple
          clearable
          :options="configStore.libraries"
          :option-label="libraryLabel"
          label="Listen Libraries"
          hint="will match all libraries if empty"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import {useConfigUpdateStore} from "@/stores/configUpdate";
import {computed, ref} from "vue";

const configStore = useConfigUpdateStore()
const config = configStore.kavita
const apiKeyDisabled = ref(config.apiKey == '')

function libraryLabel(library: { name: string | null, id: string }) {
  return `${library.name} (${library.id})`
}
</script>


<style scoped lang="scss">
@import '../../styles/scoped.scss';
</style>

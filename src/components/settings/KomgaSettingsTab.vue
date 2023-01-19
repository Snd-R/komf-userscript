<template>
  <div class="column">
    <div class="text-h6 gt-xs q-pb-lg">
      <q-icon name="mdi-server"/>
      Komga
    </div>
    <div class="col-auto">
      <q-input
          v-model="config.baseUri"
          label="Base Uri"
          filled
      />
    </div>

    <div class="col-auto" style="padding: 8px 0 0 0">
      <q-input
          v-model="config.user"
          label="User"
          filled
      />
    </div>
    <div class="col-auto" style="padding: 8px 0 0 0">
      <div class="row">
        <div class="col" style="padding: 0">
          <q-input
              v-model="config.password"
              label="Password"
              :type="isPwd ? 'password' : 'text'"
              filled
              :disable="config.passwordDisabled"
          >
            <template v-slot:append v-if="!config.passwordDisabled">
              <q-icon
                  :name="isPwd ? 'mdi-eye-off' : 'mdi-eye'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
        </div>
        <div class="col-auto" v-if="config.passwordDisabled" style="padding: 0">
          <q-btn
              @click="config.password=''; config.passwordDisabled = false"
              flat
              round
              icon="mdi-pencil"
              size="md"
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
import {ref} from "vue";

let isPwd = ref(true)
let configStore = useConfigUpdateStore()
let config = configStore.komga

function libraryLabel(library: { name: string | null, id: string }) {
  return `${library.name} (${library.id})`
}

</script>

<style scoped lang="scss">
@import '../../styles/scoped.scss';
</style>

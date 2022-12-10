<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" @before-hide="dialogCancel">
    <q-card class="q-dialog-plugin" style="max-width: 800px; width: 800px">
      <q-card-section>

        <div class="text-h6 gt-xs q-pb-lg">
          <q-icon name="mdi-cog"/>
          Settings
        </div>

        <q-card flat>
          <q-input class="q-pt-sm q-pb-sm" v-model="komfUrl" label="komf url" filled/>
          <div class="row justify-start">
            <q-btn class="col-3 text-body2" color="secondary" no-caps @click="checkConnection">Check connection</q-btn>
            <div class="col-2 offset-md-1" v-if="connectionSucces"> Connected
              <q-icon name="mdi-check"
                      color="positive"/>
            </div>
            <div class="col-2 offset-md-1" v-if="connectionError"> {{ connectionError }}
              <q-icon
                  name="mdi-alert-circle" color="negative"/>
            </div>
          </div>

          <q-card-actions align="right" class="q-pt-lg q-pb-sm">
            <q-btn @click="onDialogCancel">Cancel</q-btn>
            <q-btn color="secondary" @click="dialogConfirm">
              Save
            </q-btn>
          </q-card-actions>
        </q-card>

      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue'
import {useDialogPluginComponent} from 'quasar'
import {useSettingsStore} from '@/stores/settings'
import type KomfMetadataService from '../services/komf-metadata.service'
import {komfMetadataKey} from '@/injection-keys'

defineEmits([
  ...useDialogPluginComponent.emits
])

const metadataService = inject<KomfMetadataService>(komfMetadataKey) as KomfMetadataService

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const settings = useSettingsStore()
const komfUrl = ref(settings.komfUrl)
const connectionLoading = ref(false)
const connectionError = ref('')
const connectionSucces = ref(false)


function dialogCancel() {
  komfUrl.value = settings.komfUrl
}

function dialogConfirm() {
  settings.komfUrl = komfUrl.value
  onDialogOK()
}

async function checkConnection() {
  connectionError.value = ''
  connectionSucces.value = false
  connectionLoading.value = true
  try {
    await metadataService.checkConnection(komfUrl.value)
  } catch (e) {
    if (e instanceof Error) connectionError.value = e.message
    else connectionError.value = String(e)
    connectionLoading.value = false
    return
  }

  connectionSucces.value = true
  connectionLoading.value = false
}
</script>

<style scoped lang="scss">
@import '../styles/fixed.scss';
</style>

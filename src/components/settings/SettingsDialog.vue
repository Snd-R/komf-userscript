<template>
  <q-dialog ref="dialogRef"
            @hide="onDialogHide"
            @before-hide="dialogCancel"
            allow-focus-outside
            :persistent="configUpdating">
    <div class="flex" style="max-width: 800px; width: 800px; max-height: 850px">
      <q-card class="q-dialog-plugin full-width">
        <q-card-section horizontal>
          <q-splitter
              v-model="splitterModel"
              disable
              style="min-height: 300px"
          >
            <template v-slot:before>
              <q-tabs
                  v-model="tab"
                  vertical
                  shrink
                  inline-label
                  active-color="info"
                  :class="{ 'text-teal': connectionSuccess, 'text-blue-grey': !connectionSuccess }"
              >
                <q-tab name="connection" label="Connection"
                       :icon="settings.mediaServer === MediaServer.Komga?
                      'mdi-connection' :'fa fa-plug'"/>
                <q-tab name="komga" label="Komga"
                       v-if="settings.mediaServer === MediaServer.Komga"
                       :disable="!connectionSuccess"
                       icon="mdi-server"/>
                <q-tab name="kavita" label="Kavita"
                       v-if="settings.mediaServer === MediaServer.Kavita"
                       :disable="!connectionSuccess"
                       icon="fa fa-server"/>
                <q-tab name="providers" label="Providers"
                       :disable="!connectionSuccess"
                       :icon="settings.mediaServer === MediaServer.Komga?
                      'mdi-file-document' :'fa fa-file-lines'"/>
                <q-tab name="processing" label="Processing"
                       :disable="!connectionSuccess"
                       :icon="settings.mediaServer === MediaServer.Komga?
                      'mdi-file-refresh' :'fa fa-file-code'"/>
                <q-tab name="notifications" label="Notifications"
                       :disable="!connectionSuccess"
                       :icon="settings.mediaServer === MediaServer.Komga?
                      'mdi-bell' :'fa fa-bell'"/>
              </q-tabs>
            </template>

            <template v-slot:after>
              <q-tab-panels
                  v-model="tab"
                  animated
                  vertical
                  draggable="false"
                  transition-prev="fade"
                  transition-next="fade"
              >
                <q-tab-panel name="connection">

                  <div class="text-h6 gt-xs q-pb-lg">
                    <q-icon :name="settings.mediaServer === MediaServer.Komga?
                      'mdi-connection' :'fa fa-plug'"/>
                    Connection
                  </div>

                  <q-card flat>
                    <q-input class="q-pt-sm q-pb-sm" v-model="komfUrl" label="komf url" filled/>
                    <div class="row justify-start">
                      <div class="col-auto">
                        <q-btn class="text-body2" color="secondary" no-caps @click="loadConfig">Check
                          connection
                        </q-btn>
                      </div>
                      <div class="col-auto offset-md-1" v-if="connectionSuccess && !configUpdating"> Connected
                        <q-icon :name="settings.mediaServer === MediaServer.Komga?
               'mdi-check' : 'fa fa-check'"
                                color="positive"/>
                      </div>
                      <div class="col-auto offset-md-1" v-if="connectionError && !configUpdating"> {{ connectionError }}
                        <q-icon
                            :name="settings.mediaServer === MediaServer.Komga?
                   'mdi-alert-circle': 'fa fa-circle-exclamation'"
                            color="negative"/>
                      </div>
                    </div>
                  </q-card>

                </q-tab-panel>

                <q-tab-panel name="komga">
                  <KomgaSettingsTab/>
                </q-tab-panel>

                <q-tab-panel name="kavita">
                  <KavitaSettingsTab/>
                </q-tab-panel>

                <q-tab-panel name="providers">
                  <MetadataProvidersSettingsTab/>
                </q-tab-panel>

                <q-tab-panel name="processing">
                  <ProcessingSettingsTab/>
                </q-tab-panel>

                <q-tab-panel name="notifications">
                  <NotificationsSettingsTab/>
                </q-tab-panel>
              </q-tab-panels>
            </template>

          </q-splitter>
        </q-card-section>

        <q-card-actions align="right" class="q-pt-xs q-pb-md q-pr-md">
          <q-btn :disable="configUpdating" flat @click="onDialogCancel">Cancel</q-btn>
          <q-btn color="secondary" :loading="configUpdating" @click="dialogConfirm()">
            Save
          </q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import {inject, ref} from 'vue'
import {useDialogPluginComponent, useQuasar} from 'quasar'
import {useSettingsStore} from '@/stores/settings'
import type KomfMetadataService from '../../services/komf-metadata.service'
import {komfConfigKey, komfMetadataKey} from '@/injection-keys'
import MediaServer from "@/types/mediaServer";
import {errorNotification} from '@/errorNotification'
import type KomfConfigService from "@/services/komf-config.service";
import NotificationsSettingsTab from "@/components/settings/NotificationsSettingsTab.vue";
import {useConfigUpdateStore} from "@/stores/configUpdate";
import MetadataProvidersSettingsTab from "@/components/settings/MetadataProvidersSettingsTab.vue";
import ProcessingSettingsTab from "@/components/settings/ProcessingSettingsTab.vue";
import KomgaSettingsTab from "@/components/settings/KomgaSettingsTab.vue";
import KavitaSettingsTab from "@/components/settings/KavitaSettingsTab.vue";

defineEmits([
  ...useDialogPluginComponent.emits
])

const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()
const quasar = useQuasar()
const metadataService = inject<KomfMetadataService>(komfMetadataKey) as KomfMetadataService
const configService = inject<KomfConfigService>(komfConfigKey) as KomfConfigService

const settings = useSettingsStore()
const configUpdateStore = useConfigUpdateStore()

const tab = ref('connection')
const splitterModel = ref(20)

const connectionLoading = ref(false)
const connectionError = ref('')
const connectionSuccess = ref(false)
const configUpdating = ref(false)

const komfUrl = ref(settings.komfUrl)

loadConfig()

function dialogCancel() {
  komfUrl.value = settings.komfUrl
}

async function dialogConfirm() {
  settings.komfUrl = komfUrl.value.replace(/\/$/, '');
  if (connectionSuccess.value) {
    await updateConfig()
  }
  onDialogOK()
}

async function checkConnection() {
  connectionError.value = ''
  connectionSuccess.value = false
  connectionLoading.value = true
  try {
    await metadataService.checkConnection(komfUrl.value.replace(/\/$/, ''))
  } catch (e) {
    if (e instanceof Error) connectionError.value = e.message
    else connectionError.value = String(e)
    connectionLoading.value = false
    return
  }

  connectionSuccess.value = true
  connectionLoading.value = false
}

async function updateConfig() {
  configUpdating.value = true

  let config = configUpdateStore.getUpdates()
  if ( Object.entries(config).every(val => val[1] === undefined)) {
    configUpdating.value = false
    return
  }

  try {
    await configService.updateConfig(config)
  } catch (e) {
    errorNotification(e, quasar)
    dialogCancel()
    onDialogCancel()
    return
  }
  await loadConfig()
  let pollRetries = 0
  while (!connectionSuccess.value && pollRetries <= 5) {
    pollRetries += 1
    await new Promise(resolve => setTimeout(resolve, 1000))
    await loadConfig()
  }
  configUpdating.value = false

  if (pollRetries >= 5) {
    quasar.notify({
      message: "Connection Timeout",
      color: 'negative',
      closeBtn: true,
      timeout: 5000,
    })
  }
}

async function loadConfig() {
  connectionError.value = ''
  connectionSuccess.value = false
  connectionLoading.value = true

  let config
  try {
    config = await configService.getConfigFromUrl(komfUrl.value.replace(/\/$/, ''))
  } catch (e) {
    if (e instanceof Error) connectionError.value = e.message
    else connectionError.value = String(e)
    connectionLoading.value = false
    return
  }
  configUpdateStore.reset(config)
  connectionSuccess.value = true
  connectionLoading.value = false
}
</script>

<style scoped lang="scss">
@import '../../styles/scoped.scss';
</style>

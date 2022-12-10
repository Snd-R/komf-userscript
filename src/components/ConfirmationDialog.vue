<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" @before-hide="dialogCancel">
    <q-card class="q-dialog-plugin" style="max-width: 450px; width: 450px">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>

        <div class="row q-pa-md">
          <div class="col" v-if="body && !bodyHtml">{{ body }}</div>
          <div class="col" v-if="bodyHtml" v-html="bodyHtml"></div>
        </div>

        <div class="row" v-if="confirmText">
          <div class="col">
            <q-checkbox v-model="confirmation" :color="buttonConfirmColor">
              {{ confirmText }}
            </q-checkbox>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn @click="onDialogCancel">{{ buttonCancel || 'Cancel' }}</q-btn>
        <q-btn :color="buttonColor" @click="dialogConfirm" :disable="confirmText != null && !confirmation">
          {{ buttonConfirm }}
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useDialogPluginComponent} from 'quasar'

defineEmits([
  ...useDialogPluginComponent.emits
])
const {dialogRef, onDialogHide, onDialogOK, onDialogCancel} = useDialogPluginComponent()


const props = defineProps({
  value: Boolean,
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: false,
  },
  bodyHtml: {
    type: String,
    required: false,
  },
  confirmText: {
    type: String,
    required: false,
  },
  buttonCancel: {
    type: String,
    required: false,
  },
  buttonConfirm: {
    type: String,
    required: true,
  },
  buttonConfirmColor: {
    type: String,
    default: 'primary',
  },
})

const confirmation = ref(false)

const buttonColor = computed(() => confirmation.value ? props.buttonConfirmColor : '')

function dialogCancel() {
  confirmation.value = false
}

function dialogConfirm() {
  onDialogOK()
}
</script>

<style scoped lang="scss">
@import '../styles/fixed.scss';
</style>

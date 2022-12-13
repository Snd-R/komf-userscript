<template>
  <Teleport :to="settingsElement">
    <q-btn
        flat no-caps align="left"
        outline
        size="14px"
        class="text-body1 transparent full-width settings-button"
        icon="fa fa-puzzle-piece"
        @click="settingsDialog">
    </q-btn>
  </Teleport>
  <Teleport :to="libraryActionsElement">
    <KavitaLibraryActions/>
  </Teleport>
  <Teleport :to=seriesActionsElement>
    <KavitaSeriesActionsMenu/>
  </Teleport>
</template>

<script setup lang="ts">
import type {Ref} from 'vue'
import {ref} from 'vue'
import {useQuasar} from 'quasar'
import SettingsDialog from './components/SettingsDialog.vue'
import KavitaSeriesActionsMenu from "@/components/KavitaSeriesActionsMenu.vue";
import KavitaLibraryActions from "@/components/KavitaLibraryActions.vue";

const $q = useQuasar()
$q.dark.set(true)

const library = ref(false)
const series = ref(false)
const navigationMenu = ref(false)

const settingsElement = ref(document.createElement('div'))
const libraryActionsElement: Ref<HTMLElement> = ref(document.createElement('div'))
libraryActionsElement.value.setAttribute('class', 'col-auto')
const seriesActionsElement = ref(document.createElement('div'))
seriesActionsElement.value.setAttribute('class', 'col-auto ms-2')

function settingsDialog() {
  $q.dialog({
    component: SettingsDialog,
  })
}

const observer = new window.MutationObserver((mutations) => {
      for (const {addedNodes} of mutations) {
        if (!addedNodes || addedNodes.length === 0) {
          continue
        }

        for (const node of addedNodes) {
          if (node.nodeType != Node.ELEMENT_NODE || (<Element>node).children.length == 0) {
            continue
          }
          const element = node as Element

          let navBar
          if (element.nodeName == 'APP-NAV-HEADER') {
            navBar = element.firstElementChild?.firstElementChild
          } else if (element.nodeName == 'NAV') {
            navBar = element.firstElementChild
          }

          if (navBar) {
            navBar.insertBefore(settingsElement.value, navBar.children[4])
          }

          let buttons = Array.from(element.getElementsByTagName('button'))
          let editSeriesButton = buttons.find(elem => elem.getAttribute('title') == 'Edit Series information')
          if (editSeriesButton) {
            editSeriesButton.parentElement?.insertAdjacentElement('afterend', seriesActionsElement.value)
          }
          let libraryFilterButton = buttons.find(elem => elem.getAttribute('aria-label') == 'Open Filtering and Sorting')
          if (libraryFilterButton && libraryFilterButton.parentElement) {
            libraryActionsElement.value = libraryFilterButton.parentElement
          }
        }
      }
    }
)
observer.observe(document, {childList: true, subtree: true})
</script>
<style scoped lang="scss">
.settings-button:hover {
  border: 2px solid white;
  border-radius: 20%;
}

.settings-button {
  border: 2px solid transparent;
  border-radius: 20%;
  padding: 6px 12px 6px 12px;
}
</style>

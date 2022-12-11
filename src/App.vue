<template>
  <div class="komf-app">
    <Teleport :to="menuElement">
      <q-btn v-if="navigationMenu" flat no-caps align="left" class="text-body1 transparent full-width" icon="mdi-puzzle"
             @click="settingsDialog">
        <div style="margin-left: 30px">Komf Settings</div>
      </q-btn>
    </Teleport>
    <Teleport :to="toolbarElement">
      <LibraryActionsMenu v-if="library"/>
    </Teleport>
    <Teleport :to=toolbarElement>
      <SeriesActionsMenu v-if="series"/>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import LibraryActionsMenu from '@/components/LibraryActionsMenu.vue'
import SeriesActionsMenu from '@/components/SeriesActionsMenu.vue'
import {ref} from 'vue'
import {Theme} from './types/themes'
import {useQuasar} from 'quasar'
import SettingsDialog from './components/SettingsDialog.vue'

const $q = useQuasar()

const library = ref(false)
const series = ref(false)
const navigationMenu = ref(false)

const menuElement = ref(document.createElement('div'))
const toolbarElement = ref(document.createElement('div'))

let theme
let storage = localStorage.getItem('vuex')
if (storage) {
  let state = JSON.parse(storage)
  if ('persistedState' in state) {
    theme = state.persistedState.theme
  }
}

if (theme) {
  switch (theme) {
    case Theme.DARK:
      $q.dark.set(true)
      break

    case Theme.SYSTEM:
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
        $q.dark.set(true)
      else
        $q.dark.set(false)
      break

    default:
      $q.dark.set(false)
      break
  }
}

function settingsDialog() {
  $q.dialog({
    component: SettingsDialog,
  })
}

const observer = new window.MutationObserver((mutations) => {
  for (const {addedNodes, removedNodes} of mutations) {
    if (
        !addedNodes ||
        !removedNodes ||
        (addedNodes.length === 0 && removedNodes.length === 0)
    ) {
      continue
    }

    for (const node of removedNodes) {
      if (node.nodeName != 'DIV' || node.childNodes.length == 0) {
        continue
      }

      let drawer_content = Array.from((<Element>node).getElementsByClassName('v-navigation-drawer__content'))
      let menus = drawer_content.find(node => node.parentElement?.tagName == 'NAV')?.children.item(2)
      if (menus) {
        navigationMenu.value = false
      }
    }

    for (const node of addedNodes) {
      if (node.nodeName != 'DIV' || node.childNodes.length == 0) {
        continue
      }


      let drawer_content = Array.from((<Element>node).getElementsByClassName('v-navigation-drawer__content'))
      let menus = drawer_content.find(node => node.parentElement?.tagName == 'NAV')?.children.item(2)
      if (menus) {
        menuElement.value = document.createElement('div')
        menus.insertBefore(menuElement.value, menus.children[menus.children.length - 1])
        navigationMenu.value = true
      }
      let toolbar = (<Element>node).querySelector('.v-main__wrap .v-toolbar__content')
      if (toolbar && toolbar.parentElement && !toolbar.parentElement.classList.contains('hidden-sm-and-up')) {
        toolbarElement.value = document.createElement('div')
        toolbar?.children[4].insertAdjacentElement('afterend', toolbarElement.value)
        const type = window.location.pathname.split('/')[1]
        if (type == 'libraries') {
          library.value = true
          series.value = false
        } else if (type == 'series') {
          series.value = true
          library.value = false
        } else {
          library.value = false
          series.value = false
        }
      }
    }
  }

})
observer.observe(document, {childList: true, subtree: true})
</script>

<style scoped lang="scss">
@import 'styles/fixed.scss';
</style>

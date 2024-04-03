<template>
  <Teleport :to="menuElement">
    <q-btn flat no-caps align="left" class="text-body1 transparent full-width" icon="mdi-puzzle"
           @click="settingsDialog"
    >
      <div style="margin-left: 30px">Komf Settings</div>
    </q-btn>
  </Teleport>
  <Teleport :to="libraryActionsElement">
    <KomgaLibraryActions />
  </Teleport>
  <Teleport :to=seriesActionsElement>
    <KomgaSeriesActions />
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Theme } from './types/themes'
import { useQuasar } from 'quasar'
import SettingsDialog from './components/settings/SettingsDialog.vue'
import KomgaSeriesActions from '@/components/KomgaSeriesActions.vue'
import KomgaLibraryActions from '@/components/KomgaLibraryActions.vue'

const $q = useQuasar()

const menuElement = ref(document.createElement('div'))
const libraryActionsElement = ref(document.createElement('div'))
const seriesActionsElement = ref(document.createElement('div'))

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
        component: SettingsDialog
    })
}

const observer = new window.MutationObserver((mutations) => {
    for (const { addedNodes, removedNodes } of mutations) {
        if (
            !addedNodes ||
            !removedNodes ||
            (addedNodes.length === 0 && removedNodes.length === 0)
        ) {
            continue
        }

        for (const node of addedNodes) {
            if (node.nodeName != 'DIV' || node.childNodes.length == 0) {
                continue
            }


            let drawer_content = Array.from((<Element>node).getElementsByClassName('v-navigation-drawer__content'))
            let menus = drawer_content.find(node => node.parentElement?.tagName == 'NAV')?.children.item(2)
            if (menus) {
                menus.insertBefore(menuElement.value, menus.children[menus.children.length - 1])
            }

            let toolbar = (<Element>node).querySelector('.v-main__wrap .v-toolbar__content')
            if (toolbar && toolbar.parentElement && !toolbar.parentElement.classList.contains('hidden-sm-and-up')) {
                const path_split = window.location.pathname.split('/').reverse()
                if (path_split.find(el => el == 'libraries')) {
                    toolbar?.children[4].insertAdjacentElement('afterend', libraryActionsElement.value)
                } else if (path_split.find(el => el == 'series')) {
                    toolbar?.children[4].insertAdjacentElement('afterend', seriesActionsElement.value)
                } else if (path_split.find(el => el == 'oneshot')) {
                    toolbar?.children[2].insertAdjacentElement('afterend', seriesActionsElement.value)
                }
            }
        }
    }

})
observer.observe(document, { childList: true, subtree: true })
</script>
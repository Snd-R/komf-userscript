import _, {LoDashStatic} from 'lodash'
import Vuelidate from 'vuelidate'
import vuetify from './plugins/vuetify'
import Vue from 'vue'
import store from './store'
import httpPlugin from '@/plugins/http.plugin'
import komfMetadata from '@/plugins/komf-metadata.plugin'
import App from './App.vue'

declare global {
  interface Window {
    komf: {
      url: string
    }
  }
}

window.komf = window.komf || {}

Vue.prototype.$_ = _
Vue.prototype.$eventHub = new Vue()

Vue.use(Vuelidate)
Vue.use(httpPlugin, window.komf.url)
Vue.use(komfMetadata, {http: Vue.prototype.$http})

Vue.config.productionTip = false

declare module 'vue/types/vue' {
  interface Vue {
    $_: LoDashStatic
    $eventHub: Vue
  }
}

let app: Vue

const initialize = () => {
  const observer = new window.MutationObserver((mutations) => {
    let newToolBar
    for (const {addedNodes, removedNodes} of mutations) {
      if (!addedNodes || !removedNodes || (addedNodes.length === 0 && removedNodes.length === 0)) {
        continue
      }

      for (const node of removedNodes) {
        if (node.nodeType == Node.ELEMENT_NODE && (<Element>node).childElementCount != 0) {
          const komfElement = (<Element>node).querySelector('#komf')
          if (komfElement && app) {
            app.$destroy()
          }
        }
      }

      for (const node of addedNodes) {
        if (node.nodeType == Node.ELEMENT_NODE && (<Element>node).childElementCount != 0) {
          const toolbar = (<Element>node).querySelector('.v-main__wrap .v-toolbar__content')

          if (toolbar && toolbar.parentElement && !toolbar.parentElement.classList.contains('hidden-sm-and-up')) {
            newToolBar = toolbar
          }
        }
      }
    }

    if (newToolBar) {
      const mountElement = document.createElement('div')
      mountElement.id = 'komf'
      newToolBar.appendChild(mountElement)
      app = new Vue({
        el: mountElement,
        render: h => h(App),
        vuetify,
        store,
      })
    }
  })
  observer.observe(document, {childList: true, subtree: true})
}

initialize()

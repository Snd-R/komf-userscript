import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {quasar, transformAssetUrls} from '@quasar/vite-plugin'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'

const purgecss = require('@fullhuman/postcss-purgecss')

export default defineConfig({
    plugins: [
        vue({
            template: {transformAssetUrls},
        }),
        quasar({
            sassVariables: 'src/quasar-variables.sass',
        }),
        cssInjectedByJsPlugin(),
    ],
    css: {
        postcss: {
            plugins: [
                purgecss({
                    safelist: [/^(?!h[1-6]).*$/],
                })
            ],

        }
    },
    build: {
        minify: false,
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
})

const htmlInject = require('html-webpack-inject-attributes-plugin')
const _ = require('lodash')

// vue.config.js
module.exports = {
  publicPath: '/',
  productionSourceMap: false,

  chainWebpack: (config) => {
    config.plugins.delete('prefetch') // conflicts with htmlInject
    config.plugins.delete('preload') // conflicts with htmlInject
    config.plugin('html')
      .tap(args => {
        args[0].attributes = {
          'th:href': function (tag) {
            if (_.has(tag, 'attributes.href')) {
              return `@{${tag.attributes.href}}`
            }
            return false
          },
          'th:content': function (tag) {
            if (_.has(tag, 'attributes.content')) {
              return `@{${tag.attributes.content}}`
            }
            return false
          },
          'th:src': function (tag) {
            if (_.has(tag, 'attributes.src')) {
              return `@{${tag.attributes.src}}`
            }
            return false
          },
        }
        return args
      })

    config.plugin('html-inject')
      .after('html')
      .use(htmlInject)
  },

  css: {
    extract: false,
  },
  configureWebpack: {
    optimization: {
      splitChunks: false,
    },
  },
}

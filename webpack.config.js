'use strict'

const process = require("process");

module.exports = {
  devtool: "source-map",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: [
    './dist/client/main.js'
  ],
  stats: {
    warnings: true
  },
  resolve: {
    alias: {
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  }
}
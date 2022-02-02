module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compilerOptions = {
          isCustomElement: (tag) => {
            return tag === 'midi-player' || tag === 'midi-visualizer'
          }
        }
        return options
      })
  }
}

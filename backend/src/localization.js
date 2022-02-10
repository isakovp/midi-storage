const { I18n } = require('i18n')
const path = require('path')

module.exports = () => {
  const i18n = new I18n({
    locales: ['en'],
    // eslint-disable-next-line no-undef
    directory: path.join(__dirname, 'locales'),
    defaultLocale: 'en',
    header: 'accept-language'
  })
  global.i18n = i18n
  return i18n
}

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.min.css'

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

import 'html-midi-player/dist/midi-player.min.js'

TimeAgo.addLocale(en)
TimeAgo.addLocale(ru)

TimeAgo.setDefaultLocale('ru')
const timeAgo = new TimeAgo('en-US')

const app = createApp(App)
app.use({
  install (app) {
    app.config.globalProperties.$timeAgo = timeAgo
  }
})

app.use(store).use(router).mount('#app')

import { createStore } from 'vuex'

const token = localStorage.getItem('token')
const authenticated = !!token

const user = {
  namespaced: true,
  state: {
    authenticated: authenticated,
    token: token,
    me: null
  },
  mutations: {
    changeToken (state, token) {
      state.token = token
      state.authenticated = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    setMe (state, me) {
      state.me = me
    }
  }
}

export default createStore({
  modules: {
    user
  }
})

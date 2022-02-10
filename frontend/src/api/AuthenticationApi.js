import Api from '@/api/Api'

const AuthenticationApi = {
  signIn (username, password) {
    return Api.post('/api/authenticate', { params: { username, password } })
  },
  signUp (username, name, password) {
    return Api.post('/api/signUp', { params: { username, name, password } })
  },
  me () {
    return Api.get('/api/users/me')
  },
  signOut () {
    return Api.delete('/api/authenticate')
  }
}

export default AuthenticationApi

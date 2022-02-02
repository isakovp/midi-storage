import Api from '@/api/Api'

const FilesApi = {
  signIn (username, password) {
    return Api.post('/api/authenticate', { params: { username, password } })
  },
  me () {
    return Api.get('/api/users/me')
  },
  signOut () {
    return Api.delete('/api/authenticate')
  }
}

export default FilesApi

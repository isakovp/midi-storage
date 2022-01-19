import Api from '@/api/Api'

const FilesApi = {
  signIn (username, password) {
    return Api.post('/authenticate', { params: { username, password } })
  },
  me () {
    return Api.get('/me')
  },
  signOut () {
    return Api.delete('/authenticate')
  }
}

export default FilesApi

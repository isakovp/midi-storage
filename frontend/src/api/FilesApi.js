import Api from '@/api/Api'

const FilesApi = {
  getTopFiles (page, limit, filter = 'top') {
    return Api.get('/files', { params: { page, limit, filter } })
  },
  get (id) {
    return Api.get(`/files/${id}`)
  }
}

export default FilesApi

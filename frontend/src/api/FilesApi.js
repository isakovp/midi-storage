import Api from '@/api/Api'

const FilesApi = {
  getTopFiles (page, limit, filter = 'top', query = null) {
    return Api.get('/api/files', { params: { page, limit, filter, query } })
  },
  get (id) {
    return Api.get(`/api/files/${id}`)
  },
  create (name, description, io, listener) {
    const data = new FormData()
    data.append('name', name)
    data.append('description', description)
    data.append('file', io)

    return Api.post('/api/files',
      data,
      {
        onUploadProgress: listener,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
  }
}

export default FilesApi

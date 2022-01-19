import axios from 'axios'

const axiosConfig = {
  baseURL: 'http://localhost:3001',
  timeout: 30000
}

const connection = axios.create(axiosConfig)

connection.interceptors.request.use(function (config) {
  config.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token')
  return config
})

export default connection

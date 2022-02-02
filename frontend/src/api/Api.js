import axios from 'axios'
import Promise from 'promise-polyfill'

const EXPECTED_STATUS_CODES = [401, 402, 404, 410, 422]

const axiosConfig = {
  baseURL: 'http://localhost:3001',
  timeout: 30000
}

const connection = axios.create(axiosConfig)

connection.interceptors.request.use(function (config) {
  config.headers.common.Authorization = 'Bearer ' + localStorage.getItem('token')
  return config
})

connection.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (!!error.response && EXPECTED_STATUS_CODES.includes(error.response.status)) {
    // return error to be used on UI
    return Promise.reject(error)
  } else {
    // such error will be handled by Promise._unhandledRejectionFn handler
    const err = Promise.reject(error)
    err.response = error.response
    throw err
  }
})

export default connection

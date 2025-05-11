import { authApi } from '@/app/api/poc-api-using-api-util/index.ts'
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
})

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = await authApi.getCurrentUser()
    if (user) {
      config.headers['Authorization'] = `Bearer ${user.aud}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      // Handle token refresh or logout
      await authApi.signOut()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Rate limiting and request throttling
const MAX_REQUESTS_PER_SECOND = 10
let requestsThisSecond = 0
let lastRequestTime = Date.now()

axiosInstance.interceptors.request.use(async (config) => {
  const now = Date.now()
  if (now - lastRequestTime > 1000) {
    requestsThisSecond = 0
    lastRequestTime = now
  }

  if (requestsThisSecond >= MAX_REQUESTS_PER_SECOND) {
    await new Promise(resolve => setTimeout(resolve, 1000 - (now - lastRequestTime)))
    return axiosInstance(config)
  }

  requestsThisSecond++
  return config
})

export default axiosInstance


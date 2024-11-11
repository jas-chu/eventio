import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Constants from 'expo-constants'
import { CreateEventData } from '../types'

const API_KEY = Constants.expoConfig?.extra?.apiKey
const API_URL = Constants.expoConfig?.extra?.apiUrl

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    apikey: API_KEY,
  },
})

// Request Interceptor to add Authorization header if available
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('authToken')
    const refreshToken = await SecureStore.getItemAsync('refreshToken')

    if (token) {
      config.headers.Authorization = `${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/native', { email, password })
    return response
  } catch (error: any) {
    console.error('Login failed:', error)
    throw error.response?.data || 'An error occurred while logging in'
  }
}

export const getEvents = async () => {
  try {
    const response = await api.get('/events')
    return response.data
  } catch (error: any) {
    if (error.response) {
      const errorMessage =
        error.response.data.message || 'Error while fetching events'
      const errorCode = error.response.data.code || 'UNKNOWN_ERROR'
      const issues = error.response.data.issues || []

      console.error('Error fetching events:', errorMessage)
      console.error('Error code:', errorCode)
      issues.forEach((issue: { message: string }) => {
        console.error('Issue:', issue.message)
      })
      throw new Error(errorMessage)
    }
    console.error('Network error or no response from API')
    throw new Error('Network error or no response from API')
  }
}

export const joinEvent = async (eventId: string): Promise<any> => {
  try {
    const response = await api.post(`/events/${eventId}/attendees/me`)
    return response.data
  } catch (error) {
    throw error.response?.data || 'An error occurred while joining the event'
  }
}

export const leaveEvent = async (eventId: string): Promise<any> => {
  try {
    const response = await api.delete(`/events/${eventId}/attendees/me`)
    return response.data
  } catch (error) {
    throw error.response?.data || 'An error occurred while leaving the event'
  }
}

export const createEvent = async (eventData: CreateEventData): Promise<any> => {
  try {
    const response = await api.post(`/events`, eventData)
    return response.data
  } catch (error) {
    throw error.response?.data || 'An error occurred while creating the event'
  }
}

export default api

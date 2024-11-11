import { login } from './api'
import {
  storeToken,
  storeRefreshToken,
  storeUserId,
} from '../store/authStorage'

export const authenticateUser = async (email: string, password: string) => {
  try {
    const response = await login(email, password)

    if (response.headers['authorization']) {
      await storeToken(response.headers['authorization'])
    }
    if (response.headers['refresh-token']) {
      await storeRefreshToken(response.headers['refresh-token'])
    }
    if (response.data?.id) {
      await storeUserId(response.data.id)
    }

    return response.data
  } catch (error) {
    console.error('Authentication failed:', error)
    throw error
  }
}

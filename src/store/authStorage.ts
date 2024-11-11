import * as SecureStore from 'expo-secure-store'

export const storeToken = async (token: string) => {
  await SecureStore.setItemAsync('authToken', token)
}

export const getStoredToken = async () => {
  const token = await SecureStore.getItemAsync('authToken')
  return token
}

export const storeRefreshToken = async (token: string) => {
  await SecureStore.setItemAsync('refreshToken', token)
}

export const getStoredRefreshToken = async () => {
  const token = await SecureStore.getItemAsync('refreshToken')
  return token
}

export const storeUserId = async (userId: string) => {
  await SecureStore.setItemAsync('userId', userId)
}

export const getStoredUserId = async () => {
  const userId = await SecureStore.getItemAsync('userId')
  return userId
}

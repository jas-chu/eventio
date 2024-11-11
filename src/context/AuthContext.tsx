import React, { createContext, useState, ReactNode, useContext } from 'react'
import * as SecureStore from 'expo-secure-store'

interface AuthContextType {
  isAuthenticated: boolean
  userId: string
  login: (userId: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userId, setUserId] = useState<string>('')

  React.useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await SecureStore.getItemAsync('authToken')
      const persistedUserId = await SecureStore.getItemAsync('userId')
      if (persistedUserId) {
        setUserId(persistedUserId)
      }
      if (token) {
        setIsAuthenticated(true)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (userId: string) => {
    setUserId(userId)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    setIsAuthenticated(false)
    await SecureStore.deleteItemAsync('authToken')
    await SecureStore.deleteItemAsync('refreshToken')
    await SecureStore.deleteItemAsync('userId')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

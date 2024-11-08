import React, { createContext, useState, ReactNode, useContext } from 'react'
import * as SecureStore from 'expo-secure-store'

interface AuthContextType {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // TODO: this is optional to use secureStore, evaluate if it's neccessary or not for the project now.
  React.useEffect(() => {
    const checkAuthStatus = async () => {
      const token = await SecureStore.getItemAsync('authToken')
      if (token) {
        setIsAuthenticated(true)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async () => {
    await SecureStore.setItemAsync('authToken', 'your-jwt-token')
    setIsAuthenticated(true)
  }

  const logout = async () => {
    await SecureStore.deleteItemAsync('authToken')
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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

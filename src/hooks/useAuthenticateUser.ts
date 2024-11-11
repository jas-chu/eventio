import { useState, useCallback } from 'react'
import { authenticateUser } from '../services/auth'
import { useAuth } from '../context/AuthContext'

export const useAuthenticateUser = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const { login } = useAuth()

  const authenticate = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await authenticateUser(email, password)
      setUserData(data)
      login(data?.id)
    } catch (err: any) {
      setError(
        err?.message || 'An unknown error occurred during authentication'
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    authenticate,
    isLoading,
    error,
    userData,
  }
}

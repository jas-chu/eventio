import React from 'react'
import { View, Button } from 'react-native'
import { useAuth } from '../context/AuthContext'

export const ProfileScreen: React.FC = () => {
  const { logout } = useAuth()

  return (
    <View>
      <Button title="Logout" onPress={logout} />
    </View>
  )
}

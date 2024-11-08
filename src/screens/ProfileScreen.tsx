import React from 'react'
import { View, Text, Button } from 'react-native'
import { useAuth } from '../context/AuthContext'

export const ProfileScreen = () => {
  const { logout } = useAuth()

  return (
    <View>
      <Text>Profile Screen Placeholder</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  )
}

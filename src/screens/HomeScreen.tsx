import React from 'react'
import { View, Text, Button } from 'react-native'
import { Routes } from './../navigation/Routes'

export const HomeScreen = ({ navigation }: any) => {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate(Routes.Details)}
      />
      <Button title="Create new" onPress={() => alert('show modal')} />
      <Button
        title="Profile"
        onPress={() => navigation.navigate(Routes.Profile)}
      />
    </View>
  )
}

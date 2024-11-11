import React from 'react'
import { SafeAreaView, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/navigationTypes'
import { useNavigation } from '@react-navigation/native'

export const SignUpScreen: React.FC = () => {
  const navigation: StackNavigationProp<RootStackParamList> = useNavigation()

  return (
    <SafeAreaView style={styles.container}>
      <Text>SignUp Screen Placeholder</Text>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>Back to Log in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
})

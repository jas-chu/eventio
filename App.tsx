import React from 'react'
import { AuthProvider } from './src/context/AuthContext'
import AppNavigator from './src/navigation/AppNavigator'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { ViewContextProvider } from './src/context/ViewContext'

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ViewContextProvider>
          <AppNavigator />
        </ViewContextProvider>
      </AuthProvider>
    </SafeAreaProvider>
  )
}

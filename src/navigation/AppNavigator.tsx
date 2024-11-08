import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { useAuth } from '../context/AuthContext'

import { HomeScreen } from '../screens/HomeScreen'
import { DetailsScreen } from '../screens/DetailsScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { LoginScreen } from '../screens/LoginScreen'
import { SignUpScreen } from '../screens/SignUpScreen'
import { Routes } from './Routes'

const Stack = createStackNavigator()

const AppNavigator = () => {
  const { isAuthenticated } = useAuth()

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? Routes.Home : Routes.Login}
      >
        {isAuthenticated ? (
          <>
            <Stack.Screen name={Routes.Home} component={HomeScreen} />
            <Stack.Screen name={Routes.Profile} component={ProfileScreen} />
            <Stack.Screen name={Routes.Details} component={DetailsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name={Routes.Login} component={LoginScreen} />
            <Stack.Screen name={Routes.SignUp} component={SignUpScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator

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
import BottomNavigation from '../components/BottomNavigation'
import CustomIconMenu from '../components/CustomIconMenu'
import CreateEventModal from '../components/CreateEventModal'
import { ModalContextProvider } from '../context/CreateEventModalContext'
import { EventsProvider } from '../context/EventsContext'
import { useView } from '../context/ViewContext'

const Stack = createStackNavigator()

const AppNavigator = () => {
  const { isAuthenticated } = useAuth()
  const { showCompactView, showDefaultView } = useView()

  return (
    <ModalContextProvider>
      <EventsProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName={isAuthenticated ? Routes.Home : Routes.Login}
          >
            {isAuthenticated ? (
              <>
                <Stack.Screen
                  name={Routes.Home}
                  component={HomeScreen}
                  options={() => ({
                    headerTitle: 'Events',
                    headerTitleAlign: 'center',
                    headerLeft: () => undefined,
                    headerRight: () => (
                      <CustomIconMenu
                        icons={[
                          {
                            icon: 'grid-outline',
                            onPress: showDefaultView,
                          },
                          {
                            icon: 'menu-outline',
                            onPress: showCompactView,
                          },
                        ]}
                      />
                    ),
                  })}
                />
                <Stack.Screen
                  name={Routes.Profile}
                  component={ProfileScreen}
                  options={() => ({
                    headerTitle: 'Profile',
                    headerTitleAlign: 'center',
                    headerLeft: () => undefined,
                  })}
                />
                <Stack.Screen
                  name={Routes.Details}
                  component={DetailsScreen}
                  options={() => ({
                    headerTitle: 'Details',
                    headerTitleAlign: 'center',
                  })}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  name={Routes.Login}
                  component={LoginScreen}
                  options={() => ({
                    headerShown: false,
                  })}
                />
                <Stack.Screen
                  name={Routes.SignUp}
                  component={SignUpScreen}
                  options={() => ({
                    headerShown: false,
                  })}
                />
              </>
            )}
          </Stack.Navigator>
          {isAuthenticated && <BottomNavigation />}
          {isAuthenticated && <CreateEventModal />}
        </NavigationContainer>
      </EventsProvider>
    </ModalContextProvider>
  )
}

export default AppNavigator

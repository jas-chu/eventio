import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet } from 'react-native'
import { useAuth } from '../context/AuthContext'
import { Routes } from '../navigation/Routes'

export const LoginScreen = ({ navigation }: any) => {
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // TODO: remove
    if (username === 'user' && password === 'password') {
      login()
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Sign up"
        onPress={() => navigation.navigate(Routes.SignUp)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    height: 40,
    marginBottom: 20,
    paddingLeft: 10,
  },
})

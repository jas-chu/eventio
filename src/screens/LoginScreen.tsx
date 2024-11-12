import React, { useState, useMemo } from 'react'
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useAuthenticateUser } from '../hooks/useAuthenticateUser'
import { useNavigation } from '@react-navigation/native'
import { Routes } from '../navigation/Routes'
import { RootStackParamList } from '../navigation/navigationTypes'
import { StackNavigationProp } from '@react-navigation/stack'
import { STRINGS } from '../utils/strings'
import { COLORS } from '../utils/colors'

interface LoginState {
  email: string
  password: string
}

export const LoginScreen: React.FC = () => {
  const [form, setForm] = useState<LoginState>({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  })

  const { authenticate, isLoading, error } = useAuthenticateUser()
  const navigation: StackNavigationProp<RootStackParamList> = useNavigation()

  const isEmailValid = useMemo(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(form.email)
  }, [form.email])

  const showEmailError =
    touched.email && !isEmailValid && form.email.length >= 5

  const handleChange = (name: keyof LoginState, value: string) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
  }

  const handleLogin = async () => {
    if (isEmailValid && form.password) {
      try {
        await authenticate(form.email, form.password)
      } catch (err) {
        console.error('Login failed:', err)
      }
    }
  }

  const handleSignUp = () => {
    navigation.navigate(Routes.SignUp)
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>{STRINGS.TITLE}</Text>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>{STRINGS.HEADING}</Text>
          <Text style={styles.subtitle}>{STRINGS.SUBTITLE}</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={STRINGS.EMAIL_PLACEHOLDER}
              value={form.email}
              onChangeText={(text) => handleChange('email', text)}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[styles.input, showEmailError && styles.inputError]}
              placeholderTextColor={COLORS.TEXT_TERTIARY}
            />
            {showEmailError && (
              <Text style={styles.errorText}>{STRINGS.EMAIL_ERROR}</Text>
            )}
          </View>

          <View style={styles.inputContainer}>
            <View
              style={[
                styles.passwordContainer,
                touched.password && error != null && styles.inputError,
              ]}
            >
              <TextInput
                placeholder={STRINGS.PASSWORD_PLACEHOLDER}
                value={form.password}
                onChangeText={(text) => handleChange('password', text)}
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                placeholderTextColor={COLORS.TEXT_TERTIARY}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={24}
                  color={COLORS.TEXT_TERTIARY}
                />
              </TouchableOpacity>
            </View>
            {touched.password && error && (
              <Text style={styles.errorText}>{STRINGS.AUTH_ERROR}</Text>
            )}
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={[
              styles.signInButton,
              (!isEmailValid || !form.password) && styles.signInButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={!isEmailValid || !form.password || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.signInButtonText}>{STRINGS.SIGN_IN}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {STRINGS.NO_ACCOUNT}
              <Text style={styles.signUpText} onPress={handleSignUp}>
                {STRINGS.SIGN_UP}
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

const { width } = Dimensions.get('window')
const inputWidth = Math.min(width - 48, 400)

const styles = StyleSheet.create({
  bottomContainer: {
    alignItems: 'center',
    bottom: Platform.OS === 'ios' ? 40 : 24,
    maxWidth: inputWidth,
    position: 'absolute',
    width: '100%',
  },
  container: {
    backgroundColor: COLORS.WHITE,
    flex: 1,
  },
  content: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
  },
  errorText: {
    color: COLORS.RED,
    fontSize: 12,
    marginTop: 4,
  },
  eyeIcon: {
    padding: 8,
  },
  footer: {
    alignItems: 'center',
    marginTop: 12,
  },
  footerText: {
    color: COLORS.TEXT_TERTIARY,
    fontSize: 14,
  },
  formContainer: {
    maxWidth: inputWidth,
    width: '100%',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heading: {
    color: COLORS.PRIMARY_BLACK,
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderBottomColor: COLORS.BORDER,
    borderBottomWidth: 1,
    color: COLORS.BLACK,
    fontSize: 16,
    height: 48,
    paddingVertical: 8,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputError: {
    borderBottomColor: COLORS.RED,
  },
  logo: {
    color: COLORS.PRIMARY_BLACK,
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 40,
  },
  passwordContainer: {
    alignItems: 'center',
    borderBottomColor: COLORS.BORDER,
    borderBottomWidth: 1,
    flexDirection: 'row',
  },
  passwordInput: {
    color: COLORS.BLACK,
    flex: 1,
    fontSize: 16,
    height: 48,
    paddingVertical: 8,
  },
  signInButton: {
    alignItems: 'center',
    backgroundColor: COLORS.GREEN,
    borderRadius: 4,
    height: 48,
    justifyContent: 'center',
    marginTop: 16,
    width: '100%',
  },
  signInButtonDisabled: {
    opacity: 0.5,
  },
  signInButtonText: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  signUpText: {
    color: COLORS.GREEN,
  },
  subtitle: {
    color: COLORS.TEXT_TERTIARY,
    fontSize: 16,
  },
})

import React from 'react'
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useCreateEventModal } from '../context/CreateEventModalContext'
import { useNavigation } from '@react-navigation/native'
import { Routes } from '../navigation/Routes'
import { StackNavigationProp } from '@react-navigation/stack'
import { RootStackParamList } from '../navigation/navigationTypes'

// Define constants for colors and sizes
const COLORS = {
  background: '#FFFFFF',
  border: '#3A4444',
  icon: '#FFFFFF',
  activeIcon: '#323C46',
  inactiveIcon: '#72727B',
}

const SIZES = {
  icon: 24,
  addIcon: 32,
  addButton: 56,
}

// Define tab types
type TabType = 'calendar' | 'add' | 'profile'

type IconName = keyof typeof Ionicons.glyphMap

interface BottomNavProps {
  activeTab?: TabType
  onTabChange?: (tab: TabType) => void
}

// Custom hook for managing active tab
const useActiveTab = (initialTab: TabType = 'calendar') => {
  const [activeTab, setActiveTab] = React.useState<TabType>(initialTab)
  return { activeTab, setActiveTab }
}

const NavButton: React.FC<{
  icon: IconName
  onPress: () => void
  active: boolean
}> = ({ icon, onPress, active }) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.navButton}
    activeOpacity={0.7}
  >
    <Ionicons
      name={icon}
      size={SIZES.icon}
      color={active ? COLORS.activeIcon : COLORS.inactiveIcon}
    />
  </TouchableOpacity>
)

export default function BottomNav({
  activeTab: propActiveTab,
  onTabChange,
}: BottomNavProps) {
  const insets = useSafeAreaInsets()
  const { activeTab, setActiveTab } = useActiveTab(propActiveTab)
  const { onOpenModal } = useCreateEventModal()
  const navigation: StackNavigationProp<RootStackParamList> = useNavigation()

  // Calculate bottom padding based on device
  const bottomPadding = Platform.select({
    ios: insets.bottom,
    android: 16,
    default: 16,
  })

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab)
    switch (tab) {
      case 'add':
        onOpenModal()
        break
      case 'calendar':
        navigation.navigate(Routes.Home)
        break
      case 'profile':
        navigation.navigate(Routes.Profile)
        break
      default:
        break
    }

    if (onTabChange) {
      try {
        onTabChange(tab)
      } catch (error) {
        console.error('Error in onTabChange callback:', error)
      }
    }
  }

  return (
    <View style={[styles.container, { paddingBottom: bottomPadding }]}>
      <NavButton
        icon="calendar"
        onPress={() => handleTabChange('calendar')}
        active={activeTab === 'calendar'}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleTabChange('add')}
        activeOpacity={0.9}
      >
        <View style={styles.addButtonInner}>
          <Ionicons name="add" size={SIZES.addIcon} color={COLORS.icon} />
        </View>
      </TouchableOpacity>

      <NavButton
        icon="person"
        onPress={() => handleTabChange('profile')}
        active={activeTab === 'profile'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  addButton: {
    marginBottom: 24,
  },
  addButtonInner: {
    alignItems: 'center',
    backgroundColor: COLORS.activeIcon,
    borderRadius: SIZES.addButton / 2,
    height: SIZES.addButton,
    justifyContent: 'center',
    width: SIZES.addButton,
  },
  container: {
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderTopColor: COLORS.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  navButton: {
    padding: 12,
  },
})

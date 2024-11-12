import React from 'react'
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

type IconName = keyof typeof Ionicons.glyphMap

interface CustomIconMenuProps {
  icons?: Array<{
    icon: IconName
    onPress: () => void
  }>
}

const CustomIconMenu: React.FC<CustomIconMenuProps> = ({ icons = [] }) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.rightIconContainer}>
        {icons.map((icon, index) => (
          <TouchableOpacity
            key={index}
            onPress={icon.onPress}
            style={styles.iconButton}
          >
            <Ionicons name={icon.icon} size={24} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  iconButton: {
    marginLeft: 16,
  },
  rightIconContainer: {
    flexDirection: 'row',
  },
})

export default CustomIconMenu

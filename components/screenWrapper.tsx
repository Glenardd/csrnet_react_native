import { StatusBar, StatusBarStyle } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ScreenWrapperProps {
  children: React.ReactNode
  backgroundColor?: string
  statusBarStyle?: StatusBarStyle
}

export default function ScreenWrapper({
  children,
  backgroundColor = '#ffffff',
  statusBarStyle = 'light',
}: ScreenWrapperProps) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor }]}>
      <StatusBar style={statusBarStyle} backgroundColor={backgroundColor} />
      {children}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
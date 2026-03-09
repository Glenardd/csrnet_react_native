import { useAuthContext } from '@/hooks/use-auth-context'
import { supabase } from '@/lib/supabase'
import { responsiveSize } from '@/utils/responsiveSize'
import { useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

export default function SignOutButton() {
  const router = useRouter()

  const { setIsAuthenticating } = useAuthContext()
  
  const onSignOutButtonPress = async () => {
    const { error } = await supabase.auth.signOut({ scope: "local" })

    if (error) {
      console.error('Error signing out:', error)
      return
    }

    setIsAuthenticating(false)
    router.replace({pathname:"/(auth)"})
  }

  return (
    <TouchableOpacity
      onPress={onSignOutButtonPress}
    >
      <View
        style={{
          width: responsiveSize(120),
          height: responsiveSize(50),
          borderRadius: 25,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "black", fontSize: 15, fontWeight: "600" }}>Sign out</Text>
      </View>
    </TouchableOpacity >
  )
}
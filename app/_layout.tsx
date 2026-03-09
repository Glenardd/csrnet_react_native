import AuthProvider from "@/providers/auth-provider"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"

export default function AppLayout() {
    return (
        <AuthProvider>
            <SafeAreaProvider>
                <StatusBar style="auto" />
                <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaProvider>
        </AuthProvider>
    )
}
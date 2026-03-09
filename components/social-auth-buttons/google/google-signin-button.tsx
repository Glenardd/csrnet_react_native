import { useAuthContext } from '@/hooks/use-auth-context';
import { supabase } from '@/lib/supabase';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function GoogleSignInBtn() {
    const router = useRouter()

    const { setIsAuthenticating } = useAuthContext()

    useEffect(() => {
        GoogleSignin.configure({
            webClientId: process.env.EXPO_PUBLIC_GOOGLE_AUTH_WEB_CLIENT_ID,
            offlineAccess: true,
        })
    }, [])

    const handleSignin = async () => {
        try {
            await GoogleSignin.signOut()
            await GoogleSignin.hasPlayServices()
            const response = await GoogleSignin.signIn()

            setIsAuthenticating(true);

            const { data, error } = await supabase.auth.signInWithIdToken({
                provider: 'google',
                token: response.data?.idToken!,
            })

            if (error) {
                console.log('Supabase login error:', error)
                return
            }

            // Navigate to home automatically after login
            router.replace("/(tabs)")
        } catch (error: any) {
            if (error.code === statusCodes.IN_PROGRESS) {
                console.log('Login in progress...')
                setIsAuthenticating(false)
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                console.log('Play services not available or outdated')
                setIsAuthenticating(false)
            } else {
                console.log('Google Signin error:', error)
                setIsAuthenticating(false)
            }
        } finally {
            setIsAuthenticating(false)
        }
    }

    return (
        <GoogleSigninButton onPress={handleSignin} size={GoogleSigninButton.Size.Standard} />
    )
}
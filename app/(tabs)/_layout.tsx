import MainHeader from '@/components/mainHeader';
import ScreenWrapper from '@/components/screenWrapper';
import UserIcon from '@/components/user-icon';
import { useAuthContext } from '@/hooks/use-auth-context';
import { COLORS } from '@/utils/colors';
import { responsiveSize } from '@/utils/responsiveSize';
import { MaterialIcons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';

export default function TabLayout() {

  const { session } = useAuthContext()
  const avatar_url = session?.user.user_metadata?.avatar_url

  if (!session) {
    <Redirect href="/(auth)" />
  }

  return (
    <ScreenWrapper backgroundColor={COLORS.primary}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.white,
          tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
          tabBarStyle: {
            backgroundColor: COLORS.primary,
            elevation: 0,
            shadowOpacity: 0,
            borderTopWidth: 0
          },
          tabBarItemStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
          sceneStyle: { backgroundColor: COLORS.primary }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Upload',
            headerTitle: () => <MainHeader />,
            headerStyle: { backgroundColor: COLORS.primary },
            headerRight: () => <UserIcon image_url={avatar_url}/>,
            headerShadowVisible: false,
            tabBarLabelStyle: { textAlign: 'center' as const, fontSize: responsiveSize(12) },
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="cloud-upload" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="records"
          options={{
            title: 'Records',
            headerTitle: () => <MainHeader />,
            headerStyle: { backgroundColor: COLORS.primary },
            headerRight: () => <UserIcon image_url={avatar_url}/>,
            headerShadowVisible: false,
            tabBarLabelStyle: { textAlign: 'center' as const, fontSize: responsiveSize(12) },
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="location-pin" size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </ScreenWrapper>
  );
}
import ScreenWrapper from "@/components/screenWrapper";
import { useAuthContext } from "@/hooks/use-auth-context";
import { COLORS } from "@/utils/colors";
import { Redirect, Stack } from "expo-router";

export default function CategoryLayout() {

    const { session } = useAuthContext()
    if (!session) {
        return <Redirect href="/(auth)" />
    }

    return (
        <ScreenWrapper backgroundColor={COLORS.primary}>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index"
                    options={{
                        headerShown: true,
                        headerStyle: {
                            backgroundColor: COLORS.primary,
                        },
                        headerTintColor: "white",
                        headerShadowVisible: false,
                        headerTitle: "Category",
                        contentStyle: {
                            backgroundColor: COLORS.primary,
                        }
                    }}
                />
            </Stack>
        </ScreenWrapper>
    )
}

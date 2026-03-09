import ScreenWrapper from "@/components/screenWrapper";
import { useAuthContext } from "@/hooks/use-auth-context";
import { COLORS } from "@/utils/colors";
import { Redirect, Stack } from "expo-router";

export default function ImageLayout() {

    const { session } = useAuthContext()
    if (!session) {
        return <Redirect href="/(auth)" />
    }

    return (
        <ScreenWrapper backgroundColor={COLORS.primary}>
            <Stack>
                <Stack.Screen name="index" 
                    options={{
                        headerStyle: {
                            backgroundColor: COLORS.primary,
                        },
                        headerTintColor:"white",
                        headerShadowVisible: false,
                        headerTitle:"Output"
                    }}
                />
            </Stack>
        </ScreenWrapper>
    )
}
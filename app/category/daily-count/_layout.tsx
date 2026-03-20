import { useAuthContext } from "@/hooks/use-auth-context";
import { COLORS } from "@/utils/colors";
import { Redirect, Stack } from "expo-router";

export default function CategoryLayout() {

    const { session } = useAuthContext()
    if (!session) {
        return <Redirect href="/(auth)" />
    }

    return (
        <Stack>
            <Stack.Screen name="index"
                options={{
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    headerTintColor: "white",
                    headerShadowVisible: false,
                    headerTitle: "Daily Count",
                    contentStyle: {
                        backgroundColor: COLORS.primary,
                    }
                }}
            />
        </Stack>
    )
}

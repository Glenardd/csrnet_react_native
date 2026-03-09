import { useAuthContext } from "@/hooks/use-auth-context";
import { COLORS } from "@/utils/colors";
import { Redirect, Stack, useLocalSearchParams } from "expo-router";

export default function CategoryLayout() {

    const { session } = useAuthContext()
    if (!session) {
        return <Redirect href="/(auth)" />
    }

    const { test_id } = useLocalSearchParams<{ test_id: string }>();

    return (
        <Stack>
            <Stack.Screen name="index"
                options={{
                    headerStyle: {
                        backgroundColor: COLORS.primary,
                    },
                    headerTintColor: "white",
                    headerShadowVisible: false,
                    headerTitle: "Accuracy Test",
                    contentStyle: {
                        backgroundColor: COLORS.primary,
                    }
                }}
            />
        </Stack>
    )
}

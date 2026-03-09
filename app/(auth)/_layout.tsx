import ScreenWrapper from "@/components/screenWrapper";
import { COLORS } from "@/utils/colors";
import { Stack } from "expo-router";

export default function AuthLayout() {
    return (
        <ScreenWrapper backgroundColor={COLORS.secondary}>
            <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: COLORS.secondary } }} />
        </ScreenWrapper>
    )
}
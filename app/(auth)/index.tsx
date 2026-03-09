import ScreenWrapper from "@/components/screenWrapper";
import GoogleSignInBtn from "@/components/social-auth-buttons/google/google-signin-button";
import { useAuthContext } from "@/hooks/use-auth-context";
import { COLORS } from "@/utils/colors";
import { responsiveSize } from "@/utils/responsiveSize";
import { Image } from "expo-image";
import { Redirect } from "expo-router";
import { Text, View } from "react-native";

export default function AuthContent() {

    const { session } = useAuthContext()

    if (session) {
        return <Redirect href="/(tabs)" />
    }

    return (
        <ScreenWrapper backgroundColor={COLORS.secondary}>
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", gap: 50 }}>
                <View style={{ justifyContent: "center", alignItems: "center" }}>
                    <Image source={require("@/assets/images/splashIcon.png")} style={{ height: responsiveSize(200), width: responsiveSize(200) }} />
                    <Text style={{ fontWeight: "600", color: "white", fontSize: 30 }}>Micro-Detect</Text>
                </View>
                <GoogleSignInBtn />
            </View>
        </ScreenWrapper>
    )
}
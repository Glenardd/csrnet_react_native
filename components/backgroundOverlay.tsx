import { responsiveSize, widthPadding } from "@/utils/responsiveSize";
import { StyleSheet, View } from "react-native";

export default function BackgroundOverlay({ children, height=520, width=30 }: { children: React.ReactNode, height?: number, width?: number }) {
    const styles = StyleSheet.create({
        background: {
            backgroundColor: 'white',
            borderRadius: 8,
            marginTop: responsiveSize(20),
            width: widthPadding(width),
            height: height === 0 ? "auto" : responsiveSize(height),
            overflow: "hidden",
        },
    });

    return (
        <View style={styles.background}>
            {children}
        </View>
    );
}
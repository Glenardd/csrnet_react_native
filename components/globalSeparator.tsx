import { responsiveSize } from "@/utils/responsiveSize";
import { Dimensions, StyleSheet, View } from "react-native";

export default function GlobalSeparator({
    children,
    backGroundColor,
    borderColor,
    paddingHorizontal = 0,
    paddingVertical = 0,
    justifyContent,
    alignItems,
    flexDirection,
    gap = 0
}: {
    children?: React.ReactNode;
    backGroundColor?: string;
    borderColor?: string;
    paddingHorizontal?: number;
    paddingVertical?: number;
    justifyContent?: "flex-start" | "center" | "space-between" | "space-around" | "space-evenly";
    alignItems?: "flex-start" | "center" | "flex-end" | "stretch";
    flexDirection?: "row" | "column"
    gap?: number
}) {
    const styles = StyleSheet.create({
        separator: {
            paddingVertical: paddingVertical === 0 ? 0 : responsiveSize(paddingVertical),
            paddingHorizontal: paddingHorizontal === 0 ? 0 : responsiveSize(paddingHorizontal),
            borderRadius: 10,
            borderWidth: 1,
            borderStyle: "dashed",
            borderColor: "#b8bdc4ff",
            backgroundColor: "#ffffffff",
            width: Dimensions.get("screen").width - 120,

            flexDirection,
            justifyContent,
            alignItems,
            gap: responsiveSize(gap)
        },
    });

    return (
        <View
            style={[
                styles.separator,
                { backgroundColor: backGroundColor, borderColor: borderColor },
            ]}
        >
            {children}
        </View>
    );
}
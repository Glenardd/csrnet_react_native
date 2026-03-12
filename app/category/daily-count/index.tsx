import BackgroundOverlay from "@/components/backgroundOverlay";
import ScrollableList from "@/components/scrollabeList";
import { COLORS } from "@/utils/colors";
import { useFilterDays } from "@/utils/filterDays";
import { dates } from "@/utils/mock-data";
import { responsiveSize } from "@/utils/responsiveSize";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AccuracyContent() {
    const [filterType, setFilterType] = useState<"daily" | "weekly" >("daily");

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
        },
    });

    const {listData} = useFilterDays(filterType, dates)

    return (
        <View style={styles.container}>
            <BackgroundOverlay height={520} width={30}>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                        paddingHorizontal: responsiveSize(30),
                        paddingVertical: responsiveSize(20),
                    }}
                >
                    <Pressable onPress={() => setFilterType("daily")}>
                        <Text style={{ fontSize: responsiveSize(16), color: filterType === "daily" ? COLORS.primary : "black" }}>Daily</Text>
                    </Pressable>

                    <Pressable onPress={() => setFilterType("weekly")}>
                        <Text style={{ fontSize: responsiveSize(16), color: filterType === "weekly" ? COLORS.primary : "black" }}>Weekly</Text>
                    </Pressable>
                </View>
                <ScrollableList data={listData} centered={true} scrollHeight={430} paddingVertical={0}/>
            </BackgroundOverlay>
        </View>
    );
}
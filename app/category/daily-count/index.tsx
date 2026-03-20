import BackgroundOverlay from "@/components/backgroundOverlay";
import ScrollableList from "@/components/scrollabeList";
import { deleteDailyCounts, getDailyCounts } from "@/services/test.service";
import { COLORS } from "@/utils/colors";
import { useDailyCount } from "@/utils/dailyCount";
import { GetDailyCounts } from "@/utils/dataTypes";
import { responsiveSize } from "@/utils/responsiveSize";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function AccuracyContent() {
    const [filterType, setFilterType] = useState<"daily" | "weekly">("daily");
    const [isLoading, setIsloading] = useState<true | false>(false);
    const [dailyCounts, setDailyCounts] = useState<GetDailyCounts[]>([])

    const { test_id } = useLocalSearchParams<{ test_id: string }>()

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
        },
    });

    useEffect(() => {
        const fetchDailyCounts = async () => {
            setIsloading(true);
            const data = await getDailyCounts(parseInt(test_id));

            setDailyCounts(data || []);
            setIsloading(false);
        };

        fetchDailyCounts();
    }, [test_id]);

    const { listData } = useDailyCount(filterType, dailyCounts || []);
    // const { listData } = useDailyCount(filterType, dates || []);

    const handleDelete = async (id: number) => {
        try {
            await deleteDailyCounts(id);

            setDailyCounts(prev => prev?.filter(daily_counts => daily_counts.id !== id));
        } catch (error) {
            console.error("Failed to delete test", error);
        }
    };

    return (
        <View style={styles.container}>
            <BackgroundOverlay height={520} width={30}>
                {isLoading ? <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}><Text>Loading...</Text></View> :
                    <>
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
                        <ScrollableList onDelete={handleDelete} data={listData} centered={true} scrollHeight={430} paddingVertical={0} />
                    </>
                }
            </BackgroundOverlay>
        </View>
    );
}
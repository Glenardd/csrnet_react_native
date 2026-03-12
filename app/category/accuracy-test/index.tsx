import BackgroundOverlay from "@/components/backgroundOverlay";
import ScrollableList from "@/components/scrollabeList";
import { useFilterDays } from "@/utils/filterDays";
import { dates_accuracy } from "@/utils/mock-data";
import { StyleSheet, View } from "react-native";

export default function AccuracyContent() {

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
        },
        text: {
            color: "white",
            fontSize: 24,
        },
    });

    const {listData} = useFilterDays("accuracy test", dates_accuracy)

    return (
        <View style={styles.container}>
            <BackgroundOverlay height={520} width={30}>
                <ScrollableList data={listData} centered={true} scrollHeight={500} paddingVertical={15}/>
            </BackgroundOverlay>
        </View>
    )
}
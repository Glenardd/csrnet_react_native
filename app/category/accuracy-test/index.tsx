import BackgroundOverlay from "@/components/backgroundOverlay";
import ScrollableList from "@/components/scrollabeList";
import { deleteAccuracyTest, getAccuracyTest } from "@/services/test.service";
import { useAccuracyTest } from "@/utils/accuracy_Test";
import { GetAccuracyTest } from "@/utils/dataTypes";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function AccuracyContent() {

    const [isLoading, setIsloading] = useState<true | false>(false);
    const [accuracyTest, setAccuracyTest] = useState<GetAccuracyTest[]>([])

    const { test_id } = useLocalSearchParams<{ test_id: string }>()

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

    useEffect(() => {
        const fetchAccuracyTest = async () => {
            setIsloading(true);
            const data = await getAccuracyTest(Number(test_id));

            setAccuracyTest(data || []);
            setIsloading(false);
        };

        fetchAccuracyTest();
    }, [test_id]);

    const handleDelete = async (id: number) => {
        try {
            await deleteAccuracyTest(id);
            setAccuracyTest(prev => prev?.filter(accuracyTest => accuracyTest.id !== id));
        } catch (error) {
            console.error("Failed to delete test", error);
        }
    };

    const { listData } = useAccuracyTest(accuracyTest || [])

    return (
        <View style={styles.container}>
            <BackgroundOverlay height={520} width={30}>
                {isLoading ? <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}><Text>Loading...</Text></View> :
                    <ScrollableList onDelete={handleDelete} data={listData} centered={true} scrollHeight={500} paddingVertical={15} />
                }
            </BackgroundOverlay>
        </View>
    )
}
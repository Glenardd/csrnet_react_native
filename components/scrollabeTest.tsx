import { GetTestTypes } from "@/utils/dataTypes";
import { responsiveSize } from "@/utils/responsiveSize";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";
import GlobalSeparator from "./globalSeparator";

export default function ScrollableTest({
    data,
    scrollHeight = 410,
    centered = false,
    marginVertical = 0,
    onDelete
}: {
    data: GetTestTypes[]
    scrollHeight?: number
    centered?: boolean
    marginVertical?: number
    onDelete: (id: number) => void
}) {

    const router = useRouter()

    const formatDate = (dateString: string) => {
        const d = new Date(dateString);

        const month = d.toLocaleString("en-US", { month: "short" });
        const day = d.getDate();
        const year = d.getFullYear();

        return `${month} ${day} ${year}`;
    };

    return (
        <View
            style={{
                marginVertical: responsiveSize(marginVertical),
                flex: centered === false ? 1 : 0,
                justifyContent: centered === false ? "flex-start" : "center",
                alignItems: centered === false ? "flex-start" : "center",
                width: "100%",
            }}
        >
            <FlatList
                data={data}
                renderItem={({ item }) => {
                    return (
                        <View style={{ paddingVertical: 8, paddingHorizontal: 20 }}>
                            <Pressable onPress={() => {
                                router.push({
                                    pathname: "/category",
                                    params: { test_id: item.id }
                                });
                            }}>
                                <GlobalSeparator
                                    paddingHorizontal={20}
                                    paddingVertical={15}
                                    justifyContent="space-between"
                                    alignItems="center"
                                    flexDirection="row"
                                    gap={responsiveSize(15)}
                                >
                                    <Text>{item.test_name}</Text>
                                    <Pressable onPress={() => {
                                        onDelete(item.id)
                                    }}>
                                        <MaterialIcons name="delete" size={24} color="black" />
                                    </Pressable>
                                </GlobalSeparator>
                            </Pressable>
                        </View>
                    );
                }}
                keyExtractor={(item) => item.id.toString()}
                style={{ maxHeight: responsiveSize(scrollHeight) }}
            />
        </View>
    );
}
import GlobalSeparator from "@/components/globalSeparator";
import { COLORS } from "@/utils/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function CategoryContent() {

    const {test_id} = useLocalSearchParams<{test_id: string}>()
    const router = useRouter();

    return (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <View style={{ flex: 1, marginTop: 20, justifyContent: "center" }}>
                {[{title:'Daily Count', pathname:"/category/daily-count"}, {title:'Accuracy Test', pathname:"/category/accuracy-test"}].map((item, index) => (
                    <View key={index} style={{
                        paddingVertical: 8,
                        paddingHorizontal: 20,
                    }}>
                        <Pressable onPress={() => {
                            router.push({
                                pathname: item.pathname as "/category/accuracy-test" | "/category/daily-count",
                                params: { test_id: test_id }
                            })
                        }}>
                            <GlobalSeparator paddingHorizontal={20} paddingVertical={15} backGroundColor={COLORS.primary} borderColor="white"><Text style={{ color: "white", textAlign:"center", fontWeight:"600" }}>{item.title}</Text></GlobalSeparator>
                        </Pressable>
                    </View>
                ))}
            </View>
        </View>
    )
}
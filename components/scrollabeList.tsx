import { COLORS } from "@/utils/colors";
import { responsiveSize } from "@/utils/responsiveSize";
import { MaterialIcons } from "@expo/vector-icons";
import { FlatList, Pressable, Text, View } from "react-native";
import GlobalSeparator from "./globalSeparator";

interface DateTypes {
  id: string;
  date?: string;
  week?: string;
  total?: number;
  trend?: "increase" | "decrease" | "no change"
  particles?: number;
  percentage?: number;
  accuracy?: number;
  predicted?: number;
}

export default function ScrollableList({
  data,
  centered = false,
  paddingVertical = 0,
  scrollHeight = 520,
}: {
  data: DateTypes[];
  centered?: boolean
  paddingVertical: number
  scrollHeight?: number
}) {

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
        paddingVertical: responsiveSize(paddingVertical),
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
              <Pressable onPress={() => { }}>
                {item.week ? (
                  <GlobalSeparator
                    paddingHorizontal={20}
                    paddingVertical={15}
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection="row"
                    gap={responsiveSize(15)}
                  >
                    <Text style={{ fontWeight: "bold" }}>
                      {item.week}
                    </Text>

                    <Text style={{ fontWeight: "bold" }}>
                      Total: {item.total ?? 0}
                    </Text>

                    {/* indicators */}
                    {item.trend !== "no change" ? (
                      <Text
                        style={{
                          fontWeight: "bold",
                          color:
                            item.trend === "increase"
                              ? "#ff4d4d"
                              : "#4CAF50"
                        }}
                      >
                        {item.trend === "increase" ? "+" : "-"}{" "}
                        {item.percentage}%
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: COLORS.none
                        }}
                      >
                        - %
                      </Text>
                    )}

                  </GlobalSeparator>
                ) : (
                  <GlobalSeparator
                    paddingHorizontal={20}
                    paddingVertical={15}
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection="row"
                    gap={responsiveSize(15)}
                  >
                    <View>
                      <Text style={{ fontWeight: "bold", fontSize: responsiveSize(15) }}>
                        {item.date ? formatDate(item.date) : "No Date"}
                      </Text>

                      {item.accuracy !== undefined ? (
                        <View>
                          <Text style={{ fontWeight: "bold", fontSize: responsiveSize(11) }}>Real Count: {item.total ??  0}</Text>
                          <Text style={{ fontWeight: "bold", fontSize: responsiveSize(11) }}>predicted: {item.predicted ?? 0}</Text>
                        </View>
                      ) : (
                        <View>
                          <Text style={{ fontWeight: "bold", fontSize: responsiveSize(11) }}>Particles: {item.total ?? item.particles ?? 0}</Text>
                        </View>
                      )}
                    </View>
                    {/* indicators */}
                    {item.accuracy !== undefined ? (
                      <Text
                        style={{
                          fontWeight: "bold",
                          color:
                            item.accuracy >= 75
                              ? "#4CAF50"
                              : item.accuracy >= 50
                                ? "#FFC107"
                                : "#ff4d4d",
                        }}
                      >
                        {item.accuracy}%
                      </Text>
                    ) : item.trend !== "no change" ? (
                      <Text
                        style={{
                          fontWeight: "bold",
                          color:
                            item.trend === "increase"
                              ? "#ff4d4d"
                              : "#4CAF50",
                        }}
                      >
                        {item.trend === "increase" ? "+" : "-"} {item.percentage}%
                      </Text>
                    ) : (
                      <Text style={{ color: COLORS.none }}>0 %</Text>
                    )}

                    <MaterialIcons name="delete" size={24} color="black" />
                  </GlobalSeparator>
                )}
              </Pressable>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
        style={{ maxHeight: responsiveSize(scrollHeight) }}
      />
    </View>
  );
}
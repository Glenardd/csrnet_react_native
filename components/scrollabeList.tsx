import { getImageUrl } from "@/services/test.service";
import { COLORS } from "@/utils/colors";
import { responsiveSize } from "@/utils/responsiveSize";
import { microplasticSeverity } from "@/utils/severity";
import { MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { Dimensions, FlatList, Pressable, Text, View } from "react-native";
import DensityMap from "./densityMap";
import GlobalSeparator from "./globalSeparator";
import LoadingScreen from "./loadingScreen";
import ModalWrapper from "./modalWrapper";

interface DateTypes {
  id: number;
  date?: string;
  week?: string;
  real_count?: number
  totalParticles?: number;
  totalLiters?: number;
  trend?: "increase" | "decrease" | "no change";
  particles?: number;
  liters?: number
  percentage?: number;
  accuracy?: number;
  predicted?: number;
  original_img?: string,
  density_map_img?: number[]
}

export default function ScrollableList({
  data,
  centered = false,
  paddingVertical = 0,
  scrollHeight = 520,
  onDelete
}: {
  data: DateTypes[];
  centered?: boolean
  paddingVertical: number
  scrollHeight?: number
  onDelete: (id: number) => void
}) {
  const { width } = Dimensions.get("screen");
  const width_ = width - 30 * 2;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showOriginalImg, setShowOriginalImg] = useState<boolean>(false);
  const [showDensityMap, setShowDensityMap] = useState<boolean>(false);
  const [showImg, setShowImg] = useState<boolean>(false);

  const [img, setImg] = useState<DateTypes>()
  const [imgLoading, setImgLoading] = useState<boolean>(false);


  // density map
  const normalizedMap = img?.density_map_img
    ? new Float32Array(img.density_map_img)
    : null;
  const mapWidth = 31;
  const mapHeight = 31;

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
        ListEmptyComponent={() => <View style={{ justifyContent: "center", alignItems: "center" }}><Text style={{ color: "#b1b1b1ff" }}>No records</Text></View>}
        contentContainerStyle={
          data.length === 0
            ? { flexGrow: 1, justifyContent: "center" }
            : undefined
        }
        renderItem={({ item }) => {

          const particles_weekly = item.totalParticles ?? item.particles ?? 0;
          const liters_weekly = item.totalLiters ?? item.liters ?? 0;

          const particles_daily = item.particles ?? 0;
          const liters_daily = item.liters ?? 0;

          const severity_weekly = {
            level: liters_weekly > 0 ? microplasticSeverity(particles_weekly, liters_weekly).level : "N/A",
            color: liters_weekly > 0 ? microplasticSeverity(particles_weekly, liters_weekly).color : "black"
          }

          const severity_daily = {
            level: liters_daily > 0 ? microplasticSeverity(particles_daily, liters_daily).level : "N/A",
            color: liters_daily > 0 ? microplasticSeverity(particles_weekly, liters_daily).color : "black"
          }

          return (
            <View style={{ paddingVertical: 8, paddingHorizontal: 20 }}>
              <Pressable onPress={() => { }}>
                {/* week or daily*/}
                {item.week ? (
                  <GlobalSeparator
                    paddingHorizontal={20}
                    paddingVertical={15}
                    justifyContent="space-between"
                    alignItems="center"
                    flexDirection="row"
                    gap={responsiveSize(15)}
                  >
                    <View>

                      {/*  number of week */}
                      <Text style={{ fontWeight: "bold" }}>
                        {item.week}
                      </Text>

                      {/* total particles */}
                      <Text style={{ fontWeight: "bold" }}>
                        Total Particles: {item.totalParticles ?? 0}
                      </Text>

                      {/* total liters this week */}
                      <Text style={{ fontWeight: "bold" }}>
                        Total Liters: {item.totalLiters ?? 0} L
                      </Text>

                      <View style={{ flexDirection: "row" }}>
                        <Text style={{ fontWeight: "bold" }}>Severity: </Text>
                        <Text style={{ fontWeight: "bold", color: severity_weekly.color }}>
                          {severity_weekly.level}
                        </Text>
                      </View>
                    </View>

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
                      <Pressable onPress={async () => {
                        if (!item.original_img) return;
                        setShowImg(true);
                        setImgLoading(true); // show loading immediately

                        const signedUrl = await getImageUrl(item.original_img);

                        setImg({
                          ...item,
                          original_img: signedUrl ?? undefined
                        });
                        setImgLoading(false);

                      }}>
                        <Text style={{ fontWeight: "bold", fontSize: responsiveSize(15) }}>
                          {item.date ? formatDate(item.date) : "No Date"}
                        </Text>
                      </Pressable>
                      {item.accuracy !== undefined ? (
                        <View>
                          <Text style={{ fontWeight: "bold", fontSize: responsiveSize(11) }}>Real Count: {item.real_count ?? 0}</Text>
                          <Text style={{ fontWeight: "bold", fontSize: responsiveSize(11) }}>predicted: {item.predicted ?? 0}</Text>
                        </View>
                      ) : (
                        <View>
                          <Text style={{ fontWeight: "bold", fontSize: responsiveSize(11) }}>Particles: {item.totalParticles ?? item.particles ?? 0}</Text>
                          <Text style={{ fontWeight: "bold", fontSize: responsiveSize(11) }}>Liters: {item.totalParticles ?? item.liters ?? 0} L</Text>
                          <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontWeight: "bold", fontSize: responsiveSize(11) }}>Severity: </Text>
                            <Text style={{ fontWeight: "bold", fontSize: responsiveSize(11), color: severity_daily.color }}>{severity_daily.level}</Text>
                          </View>
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

                    <Pressable
                      style={{ position: "absolute", top: 10, right: 10 }}
                      onPress={async () => {
                        setIsLoading(true);
                        await onDelete(item.id)
                        setIsLoading(false);
                      }}
                    >
                      <MaterialIcons name="delete" size={24} color="black" />
                    </Pressable>
                  </GlobalSeparator>
                )}
              </Pressable>
            </View>
          );
        }}
        keyExtractor={(item) => item.id.toString()}
        style={{ maxHeight: responsiveSize(scrollHeight) }}
      />
      <LoadingScreen isLoading={isLoading} message="Deleting..." />

      {/* show modal when test contents pressed */}
      <ModalWrapper visible={showImg} onClose={() => setShowImg(false)}>
        {imgLoading ? (
          <View style={{
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8
          }}>
            <Text>Loading...</Text>
          </View>
        ) :
          (<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10 }}>
            {img?.original_img && (
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontWeight: "600", marginBottom: 4 }}>Image</Text>
                <Pressable onPress={() => setShowOriginalImg(true)}>
                  <Image
                    source={{ uri: img.original_img }}
                    style={{ width: width_ * 0.4, height: width_ * 0.4 }}
                    contentFit="cover"
                    cachePolicy="none"
                  />
                </Pressable>
              </View>)}

            {normalizedMap && (
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text style={{ fontWeight: "600", marginBottom: 4 }}>Density Map</Text>
                <DensityMap
                  normalizedMap={normalizedMap}
                  mapWidth={mapWidth}
                  mapHeight={mapHeight}
                  displaySize={width_ * 0.4}
                />
              </View>
            )}
          </View>)
        }
      </ModalWrapper >
    </View >
  );
}
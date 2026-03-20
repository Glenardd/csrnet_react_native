import DensityMap from "@/components/densityMap";
import GlobalSeparator from "@/components/globalSeparator";
import InputModal from "@/components/inputModal";
import LoadingScreen from "@/components/loadingScreen";
import ModalWrapper from "@/components/modalWrapper";
import { createAccuracyTests, createDailyCounts, getTest, uploadImage } from "@/services/test.service";
import { GetTestTypes, InsertAccuracyTests, InsertDailyCounts } from "@/utils/dataTypes";
import { responsiveSize } from "@/utils/responsiveSize";
import { microplasticSeverity } from "@/utils/severity";
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function ImagePage() {
    const { image_uri, count, density_map, map_width, map_height } = useLocalSearchParams<{
        image_uri: string;
        count: string;
        density_map: string;
        map_width: string;
        map_height: string;
    }>();
    const [modalVisible, setModalVisible] = useState(true);
    const [litersInput, setLitersInput] = useState<string>("");
    const [submittedLiters, setSubmittedLiters] = useState<string>("");
    const [inputError, setInputError] = useState<true | false>(false);
    const [test_, setTest_] = useState<{ id: number, test_name: string }>()
    const [showDatePicker, setShowDatePicker] = useState<true | false>(false);
    const [date, setDate] = useState<Date>(new Date());
    const [showSave, setShowSave] = useState<true | false>(false);
    const [showType, setShowType] = useState<true | false>(false);
    const [types, setTypes] = useState<"daily_counts" | "accuracy_tests" | undefined>()
    const [realCount, setRealCount] = useState<string>("")
    const [showRealCount, setShowRealCount] = useState<true | false>(false);
    const [submittedRealCount, setSubmittedRealCount] = useState<string>("");
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [showDensityMap, setShowDensityMap] = useState<boolean>(false);
    const [showOriginalImg, setShowOrignalImg] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { width } = Dimensions.get("screen");
    const width_ = width - 30 * 2;

    const [tests, setTests] = useState<GetTestTypes[]>([]);
    const [loadingTests, setLoadingTests] = useState<true | false>(false);

    useEffect(() => {
        const fetchTests = async () => {
            setLoadingTests(true);
            const data = await getTest();
            setTests(data || []);
            setLoadingTests(false);
        };

        fetchTests();
    }, []);

    const normalizedMap = density_map ? new Float32Array(JSON.parse(density_map)) : null;
    const mapWidth = map_width ? parseInt(map_width) : 31;
    const mapHeight = map_height ? parseInt(map_height) : 31;

    const severity = microplasticSeverity(parseInt(count as string), submittedLiters ? parseFloat(submittedLiters) : 1);

    //date set
    const onChangeDate = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSubmit_liters = () => {
        const value = parseFloat(litersInput);
        if (isNaN(value) || litersInput === '' || value <= 0) {
            setInputError(true);
            return;
        };
        setSubmittedLiters(litersInput); //only update display on submit
        setInputError(false);
        setModalVisible(false);
    };

    const handleSubmit_realCount = () => {
        const value = parseFloat(realCount);
        if (isNaN(value) || realCount === '' || value <= 0) {
            setInputError(true);
            return;
        };
        setSubmittedRealCount(realCount); //only update display on submit
        setInputError(false);
        setShowRealCount(false);
    };

    // submission
    const handleCreateDailyCounts = async (data: InsertDailyCounts) => {
        try {
            await createDailyCounts(data);
        } catch (error) {
            console.error("Failed to create test", error);
        };
    };

    const handleAccuracyTests = async (data: InsertAccuracyTests) => {
        try {
            await createAccuracyTests(data);
        } catch (error) {
            console.error("Failed to create test", error);
        };
    };

    const hasMissingFields =
        !types ||
        !submittedLiters ||
        !test_?.id ||
        (types === "accuracy_tests" && !submittedRealCount);

    const Separator = ({ children, style }: { children: React.ReactNode, style?: any }) => {

        return (
            <View style={[styles.separator, style]}>
                {children}
            </View>
        )
    };

    if (!image_uri) return null;

    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* density map modal */}
            <ModalWrapper
                visible={showDensityMap}
                onClose={() => setShowDensityMap(false)}
            >
                {normalizedMap && (
                    <View style={{ height: "auto", justifyContent: "center", alignItems: "center", position: "relative" }}>
                        <DensityMap
                            normalizedMap={normalizedMap}
                            mapWidth={mapWidth}
                            mapHeight={mapHeight}
                            displaySize={width_}
                        />
                    </View>
                )}
            </ModalWrapper>

            {/*  original img modal */}
            <ModalWrapper
                visible={showOriginalImg}
                onClose={() => setShowOrignalImg(false)}
            >
                {normalizedMap && (
                    <View style={{ height: "auto", justifyContent: "center", alignItems: "center", position: "relative" }}>
                        <Image
                            source={{ uri: image_uri }}
                            style={{ width: width_, height: width_ }}  // 👈 fixed height
                            contentFit="cover"
                            cachePolicy="memory-disk"
                        />
                    </View>
                )}
            </ModalWrapper>

            {/* density map with original image */}
            <View style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                width: width_,
                gap: 10
            }}>
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text style={{ fontWeight: "600", marginBottom: 4 }}>Original</Text>
                    <Pressable
                        onPress={() => setShowOrignalImg(true)}
                    >
                        <Image
                            source={{ uri: image_uri }}
                            style={{ width: width_ * 0.5, height: width_ * 0.5 }}  // 👈 fixed height
                            contentFit="cover"
                            cachePolicy="memory-disk"
                        />
                    </Pressable>
                </View>

                {normalizedMap && (
                    <View style={{ flex: 1, alignItems: "center" }}>
                        <Text style={{ fontWeight: "600", marginBottom: 4 }}>Density Map</Text>
                        <Pressable onPress={() => setShowDensityMap(true)}>
                            <DensityMap
                                normalizedMap={normalizedMap}
                                mapWidth={mapWidth}
                                mapHeight={mapHeight}
                                displaySize={width_ * 0.5}
                            />
                        </Pressable>
                    </View>
                )}
            </View>

            {/* liters input */}
            <InputModal
                title="Liters"
                value={litersInput}
                inputError={inputError}
                visible={modalVisible}
                onChangeText={(text) => {
                    setLitersInput(text);
                    setInputError(false);
                }}
                onSubmit={handleSubmit_liters}
                onClose={() => setModalVisible(false)}
            />

            {/* real counts input */}
            <InputModal
                title="Real Count"
                value={realCount}
                inputError={inputError}
                visible={showRealCount}
                onChangeText={(text) => {
                    setRealCount(text);
                    setInputError(false);
                }}
                onSubmit={handleSubmit_realCount}
                onClose={() => setShowRealCount(false)}
            />


            {/* type selection daily counts || accuracy tests */}
            <ModalWrapper visible={showType} onClose={() => setShowType(false)}>
                <Pressable onPress={() => { setTypes("daily_counts"); setShowType(false) }}>
                    <GlobalSeparator
                        paddingHorizontal={20}
                        paddingVertical={10}
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="row"
                        gap={responsiveSize(10)}
                    >
                        <Text style={styles.modalTitle}>Daily Counts</Text>
                    </GlobalSeparator>
                </Pressable>
                <Pressable onPress={() => { setTypes("accuracy_tests"); setShowType(false) }}>
                    <GlobalSeparator
                        paddingHorizontal={20}
                        paddingVertical={10}
                        justifyContent="space-between"
                        alignItems="center"
                        flexDirection="row"
                        gap={responsiveSize(10)}
                    >
                        <Text style={styles.modalTitle}>Accuracy Tests</Text>
                    </GlobalSeparator>
                </Pressable>
            </ModalWrapper>

            {/* Date picker */}
            {showDatePicker && (
                <DateTimePicker
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        onChangeDate(event, selectedDate);
                    }}
                />
            )}

            <View style={styles.row}>
                {/* type daily counts || accuracy tests */}
                <Text style={styles.label}>Type</Text>
                <Pressable onPress={() => setShowType(true)}>
                    <Separator style={submitted && !types && styles.errorBorder}>
                        <View>
                            <Text style={styles.value}>
                                {types === "accuracy_tests" ? "Accuracy Tests" : types === "daily_counts" ? "Daily Counts" : "Select Types"}
                            </Text>
                            <MaterialIcons style={{ position: "absolute", right: 5, top: 5 }} name="edit" size={16} color="#000000ff" />
                        </View>
                    </Separator>
                </Pressable>
            </View>
            <View style={styles.row}>
                {/* liters value display */}
                <Text style={styles.label}>Microplastic per Litre</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Separator style={submitted && !submittedLiters && styles.errorBorder}>
                        <View>
                            <Text style={styles.value}>
                                {submittedLiters ? `${submittedLiters} L` : 'Input Liters'}
                            </Text>
                            <MaterialIcons style={{ position: "absolute", right: 5, top: 5 }} name="edit" size={16} color="#000000ff" />
                        </View>
                    </Separator>
                </Pressable>
            </View>
            {/* date picker */}
            <View style={styles.row}>
                <Text style={styles.label}>Date</Text>
                <Pressable onPress={() => setShowDatePicker(true)}>
                    <Separator style={submitted && !date && styles.errorBorder}>
                        <View>
                            <Text style={styles.value}>{date.toLocaleDateString()}</Text>
                            <MaterialIcons style={{ position: "absolute", right: 5, top: 5 }} name="edit" size={16} color="#000000ff" />
                        </View>
                    </Separator>
                </Pressable>
            </View>

            {/* if types is accuracy tests, render this form */}
            {
                types === "accuracy_tests" ? (<View style={styles.row}>
                    <Text style={styles.label}>Microplastic Count / Real Count</Text>
                    <Pressable onPress={() => setShowRealCount(true)}>
                        <Separator style={submitted && !submittedRealCount && styles.errorBorder}>
                            <View>
                                <Text style={styles.value}>{submittedRealCount ? `${submittedRealCount} L` : "Input real count"}</Text>
                                <MaterialIcons style={{ position: "absolute", right: 5, top: 5 }} name="edit" size={16} color="#000000ff" />
                            </View>
                        </Separator>
                    </Pressable>
                </View>) : ""
            }

            <View style={styles.row}>
                <Text style={styles.label}>Microplastic Count / Predicted Count</Text>
                <Separator>
                    <Text style={styles.value}>{Math.round(parseInt(count as string))}</Text>
                </Separator>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Save in</Text>
                <ModalWrapper visible={showSave} onClose={() => setShowSave(false)}>
                    {/* test selection */}
                    <FlatList
                        data={tests}
                        ListEmptyComponent={() => <View style={{ justifyContent: "center", alignItems: "center" }}><Text style={{ color: "#b1b1b1ff" }}>Add test first</Text></View>}
                        contentContainerStyle={
                            tests.length === 0
                                ? { flexGrow: 1, justifyContent: "center" }
                                : undefined
                        }
                        renderItem={({ item }) => {
                            return (
                                <Pressable onPress={() => {
                                    setTest_({ id: item.id, test_name: item.test_name });
                                    setShowSave(false);
                                }}>
                                    <View style={{ marginVertical: responsiveSize(5) }}>
                                        <GlobalSeparator
                                            key={item.id}
                                            paddingHorizontal={20}
                                            paddingVertical={10}
                                            justifyContent="space-between"
                                            alignItems="center"
                                            flexDirection="row"
                                        // gap={responsiveSize(10)}
                                        >
                                            <Text style={styles.value}>{item.test_name}</Text>
                                        </GlobalSeparator>
                                    </View>
                                </Pressable>
                            )
                        }}
                        keyExtractor={(item) => item.id.toString()}
                        style={{ maxHeight: responsiveSize(300) }}
                    />
                </ModalWrapper>
                <Pressable onPress={() => setShowSave(true)}>
                    <Separator style={submitted && !test_?.test_name && styles.errorBorder}>
                        <View>
                            <Text style={styles.value}>{test_?.test_name ?? "-"}</Text>
                            <MaterialIcons style={{ position: "absolute", right: 5, top: 5 }} name="edit" size={16} color="#000000ff" />
                        </View>
                    </Separator>
                </Pressable>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Severity</Text>
                <Separator>
                    <Text style={[styles.value, { color: severity.color }]}>{severity.level}</Text>
                </Separator>
            </View>

            <View style={styles.row}>
                <View style={styles.modalButtons}>
                    <Pressable
                        style={[styles.Button, styles.cancelButton]}
                        onPress={() => router.back()}
                    >
                        <Text style={[styles.label, styles.cancelText]}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.Button, styles.submitButton]}
                        onPress={async () => {
                            setSubmitted(true);

                            if (!hasMissingFields) {
                                setIsLoading(true);
                                const imageUrl = await uploadImage(image_uri) ?? "";

                                if (types === "daily_counts") {
                                    handleCreateDailyCounts({
                                        particles: Math.round(parseInt(count)),
                                        test_id: test_.id,
                                        date: date.toISOString(),
                                        liters: parseInt(submittedLiters),
                                        original_img: imageUrl,
                                        density_map_img: Array.from(normalizedMap || [])
                                    });
                                } else {
                                    handleAccuracyTests({
                                        predicted_count: Math.round(parseInt(count)),
                                        real_count: parseInt(submittedRealCount),
                                        test_id: test_.id,
                                        date: date.toISOString(),
                                        liters: parseInt(submittedLiters),
                                        original_img: imageUrl,
                                        density_map_img: Array.from(normalizedMap || [])
                                    });
                                }
                                setIsLoading(false);
                                router.back();
                            }
                        }}
                    >
                        <Text style={[styles.label, styles.submitText]}>Submit</Text>
                    </Pressable>
                </View>
            </View>
            <LoadingScreen isLoading={isLoading} message="Processing..." />
        </ScrollView >
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        padding: 28
    },
    row: {
        width: Dimensions.get("screen").width - 30 * 2,
    },
    label: {
        fontWeight: "600",
        marginBottom: 4,
    },
    value: {
        fontSize: 16,
        color: "black",
    },
    separator: {
        backgroundColor: "#dadadaff",
        marginVertical: 10,
        padding: 5,
        width: Dimensions.get("screen").width - 30 * 2,
        borderRadius: 5,
    },
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    }, modalButtons: {
        flexDirection: "row",
        gap: 10,
    },
    Button: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    }, cancelButton: {
        backgroundColor: "#ff6767ff",
    },
    submitButton: {
        backgroundColor: "#4CAF50",
    },
    cancelText: {
        fontWeight: "600",
        color: "white",
    },
    submitText: {
        fontWeight: "600",
        color: "white",
    },
    errorBorder: {
        borderWidth: 1,
        borderColor: "red"
    }
});
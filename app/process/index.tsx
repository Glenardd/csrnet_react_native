import ModalWrapper from "@/components/modalWrapper";
import { getTest } from "@/services/test.service";
import { responsiveSize } from "@/utils/responsiveSize";
import { microplasticSeverity } from "@/utils/severity";
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from "@react-native-community/datetimepicker";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function ImagePage() {
    const { image_uri, count } = useLocalSearchParams();
    const [modalVisible, setModalVisible] = useState(true);
    const [litersInput, setLitersInput] = useState("");
    const [submittedLiters, setSubmittedLiters] = useState("");
    const [inputError, setInputError] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [date, setDate] = useState(new Date());

    const [showSave, setShowSave] = useState(false);

    const { width } = Dimensions.get("screen");
    const width_ = width - 30 * 2;

    const [tests, setTests] = useState<any[]>([]);
    const [loadingTests, setLoadingTests] = useState(false);

    useEffect(() => {
        const fetchTests = async () => {
            setLoadingTests(true);
            const data = await getTest();
            setTests(data || []);
            setLoadingTests(false);
        };

        fetchTests();
    }, []);

    const severity = microplasticSeverity(parseInt(count as string), submittedLiters ? parseFloat(submittedLiters) : 1);

    //date set
    const onChangeDate = (event: any, selectedDate?: Date) => {
        if (selectedDate) {
            setDate(selectedDate);
        }
    };

    const handleSubmit = () => {
        const value = parseFloat(litersInput);
        if (isNaN(value) || litersInput === '' || value <= 0) {
            setInputError(true);
            return;
        };
        setSubmittedLiters(litersInput); //only update display on submit
        setInputError(false);
        setModalVisible(false);
    };

    const Separator = ({ children }: { children: React.ReactNode }) => (
        <View style={styles.separator}>
            {children}
        </View>
    );

    if (!image_uri) return null;

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={{ uri: image_uri as string }}
                style={{ width: width_, height: responsiveSize(300) }}
                contentFit="cover"
                cachePolicy="memory-disk"
            />

            {/* liters input */}
            <ModalWrapper visible={modalVisible} onClose={() => setModalVisible(false)}>
                <Text style={styles.modalTitle}>Enter Liters</Text>

                <TextInput
                    keyboardType="numeric"
                    placeholder="e.g. 1.5"
                    placeholderTextColor="#999"
                    style={[
                        styles.modalInput,
                        inputError && { borderWidth: 1, borderColor: 'red' }
                    ]}
                    value={litersInput}
                    onChangeText={(text) => {
                        setLitersInput(text);
                        setInputError(false);
                    }}
                    autoFocus
                />

                {inputError && (
                    <Text style={{ color: 'red', fontSize: 12, marginTop: -8 }}>
                        Please enter a valid number greater than 0
                    </Text>
                )}

                <View style={styles.modalButtons}>
                    <Pressable
                        style={[
                            styles.modalButton,
                            styles.cancelButton,
                            !litersInput && { opacity: 0.4 }
                        ]}
                        onPress={() => setModalVisible(false)}
                        disabled={inputError}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.modalButton, styles.submitButton]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitText}>Submit</Text>
                    </Pressable>
                </View>
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
                <Text style={styles.label}>Microplastic per Litre</Text>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Separator>
                        <View>
                            <Text style={styles.value}>
                                {submittedLiters ? `${submittedLiters} L` : 'Input Liters'}
                            </Text>
                            <MaterialIcons style={{ position: "absolute", right: 5, top: 5 }} name="edit" size={16} color="#000000ff" />
                        </View>
                    </Separator>
                </Pressable>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Date</Text>
                <Pressable onPress={() => setShowDatePicker(true)}>
                    <Separator>
                        <Text style={styles.value}>{date.toLocaleDateString()}</Text>
                    </Separator>
                </Pressable>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Microplastic Count</Text>
                <Separator>
                    <Text style={styles.value}>{Math.round(parseInt(count as string))}</Text>
                </Separator>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Save in</Text>
                <ModalWrapper visible={showSave} onClose={() => setShowSave(false)}>
                    <Text style={styles.value}>{tests?.map(test => test.test_name).join(", ")}</Text>
                </ModalWrapper>
                <Pressable onPress={() => setShowSave(true)}>
                    <Separator>
                        <Text style={styles.value}>-</Text>
                    </Separator>
                </Pressable>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Severity</Text>
                <Separator>
                    <Text style={[styles.value, { color: severity.color }]}>{severity.level}</Text>
                </Separator>
            </View>
        </ScrollView>
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
    modalContent: {
        backgroundColor: "white",
        borderRadius: 15,
        padding: 24,
        width: Dimensions.get("screen").width - 60,
        gap: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
        textAlign: "center",
    },
    modalInput: {
        backgroundColor: "#f0f0f0",
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: "black",
    },
    modalButtons: {
        flexDirection: "row",
        gap: 10,
    },
    modalButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#f0f0f0",
    },
    submitButton: {
        backgroundColor: "#4CAF50",
    },
    cancelText: {
        fontWeight: "600",
        color: "black",
    },
    submitText: {
        fontWeight: "600",
        color: "white",
    },
});
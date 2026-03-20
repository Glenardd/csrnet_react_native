import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import ModalWrapper from "./modalWrapper";

export default function InputModal({
    title,
    value,
    inputError,
    visible,
    onChangeText,
    onSubmit,
    onClose,
}: {
    title: string
    value: string
    onSubmit: () => void
    onClose: () => void
    onChangeText: (text: string) => void
    visible: boolean
    inputError: boolean
}) {

    const styles = StyleSheet.create({
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
        }, modalTitle: {
            fontSize: 18,
            fontWeight: "600",
            textAlign: "center",
        },
    })

    return (
        <ModalWrapper visible={visible} onClose={onClose}>
            <Text style={styles.modalTitle}>Enter {title}</Text>
            <TextInput
                keyboardType="numeric"
                placeholder="e.g. 1.5"
                placeholderTextColor="#999"
                style={[
                    styles.modalInput,
                    inputError && { borderWidth: 1, borderColor: 'red' }
                ]}
                value={value}
                onChangeText={(input) => {
                    onChangeText(input)
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
                    ]}
                    onPress={onClose}
                    disabled={inputError}
                >
                    <Text style={styles.cancelText}>Cancel</Text>
                </Pressable>
                <Pressable
                    style={[styles.modalButton, styles.submitButton]}
                    onPress={onSubmit}
                    disabled={inputError}
                >
                    <Text style={styles.submitText}>Submit</Text>
                </Pressable>
            </View>
        </ModalWrapper>
    )
}
import React from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";

interface BaseModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export default function ModalWrapper({ visible, onClose, children }: BaseModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={styles.modalContent}>
                    {children}
                </View>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
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
});
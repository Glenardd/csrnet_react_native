import { responsiveSize } from "@/utils/responsiveSize";
import { Image } from "expo-image";
import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, TouchableOpacity, View } from "react-native";
import SignOutButton from "./social-auth-buttons/signout-button";

export default function UserIcon({ image_url }: { image_url: string }) {

    const [modalVisible, setModalVisible] = useState(false);

    const modal = StyleSheet.create({
        overlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        card: {
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 10,
            alignItems: 'center',
        },
    })

    return (
        <View>
            <TouchableOpacity onPress={() => {
                setModalVisible(true)
            }}>
                <Image source={{ uri: image_url }} style={{ width: responsiveSize(40), height: responsiveSize(40), marginRight: responsiveSize(12), borderRadius: 60 }} />
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                transparent={true}
            >
                <Pressable
                    onPress={() => setModalVisible(false)}
                    style={modal.overlay}
                >
                    <View style={modal.card}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            <SignOutButton />
                        </View>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
}
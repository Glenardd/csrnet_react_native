import { predictFromBase64 } from "@/utils/predict";
import { responsiveSize } from "@/utils/responsiveSize";
import { Image } from "expo-image";
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LoadingScreen from "./loadingScreen";

export default function UploadImage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: responsiveSize(230)
        },
        button: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            gap: 10
        }
    });

    const uploadImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted) {
            const result = await ImagePicker.launchImageLibraryAsync();

            if (!result.canceled && result.assets.length > 0) {
                const uri = result.assets[0].uri;

                setLoading(true);

                // Resize image
                const resized = await ImageManipulator.manipulateAsync(
                    uri,
                    [{ resize: { width: 252, height: 252 } }],
                    {
                        base64: true,
                        format: ImageManipulator.SaveFormat.JPEG,
                        compress: 0.6
                    }
                );

                // Run prediction
                const prediction = await predictFromBase64(resized.base64!);

                // Handle prediction error
                if (!prediction?.predictedCount) {
                    console.log('Prediction failed');
                    setLoading(false);
                    return;
                }

                setLoading(false);

                // Navigate to process screen
                router.push({
                    pathname: "/process",
                    params: {
                        image_uri: resized.uri,
                        count: prediction.predictedCount,
                        density_map: JSON.stringify(Array.from(prediction.normalizedMap)),
                        map_width: prediction.mapWidth,
                        map_height: prediction.mapHeight,
                    }
                });
            }
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={uploadImage}>
                <View style={styles.button}>
                    <Image
                        source={require("@/assets/images/Upload.png")}
                        style={{ width: responsiveSize(24), height: responsiveSize(24) }}
                    />
                    <Text>Upload</Text>
                    <LoadingScreen isLoading={loading} message="Processing" />
                </View>
            </TouchableOpacity>
        </View>
    );
}
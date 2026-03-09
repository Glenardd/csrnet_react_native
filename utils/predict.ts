import { Buffer } from 'buffer';
import { Asset } from 'expo-asset';
import { loadTensorflowModel } from 'react-native-fast-tflite';

// Placeholder for densityMapToImage function
// This function is not compatible with React Native and has been removed.
// You need to implement a React Native compatible version using a library like 'react-native-canvas' or 'react-native-image-editor',
// or handle the density map visualization on the backend or in a web environment.
const densityMapToImage = async (flatDensityMap: Float32Array): Promise<string> => {
    throw new Error('densityMapToImage is not implemented for React Native. Please use a compatible library or handle this on the backend.');
};

export const predictFromBase64 = async (base64: string) => {
    try {
        // Load model
        const asset = await Asset.loadAsync(require("@/assets/model/csrnet.tflite"));
        const model = await loadTensorflowModel({ url: asset[0].localUri! });

        // Convert base64 to Float32Array using Buffer
        const imgBuffer = Buffer.from(base64, 'base64');
        const float32 = new Float32Array(252 * 252 * 3);
        for (let i = 0; i < imgBuffer.length; i++) {
            float32[i] = imgBuffer[i] / 255.0;
        }

        // Run prediction
        const output = await model.run([float32]);

        // Flat density map
        const flatDensityMap = output[0] as Float32Array;

        // Sum density map to get count
        const predictedCount = flatDensityMap.reduce((a, b) => a + b, 0);

        console.log('Predicted Count:', predictedCount);

        return { predictedCount, flatDensityMap };

    } catch (error) {
        console.error(error);
    }
};
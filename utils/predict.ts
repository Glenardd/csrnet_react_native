import { AlphaType, ColorType, Skia } from '@shopify/react-native-skia';
import * as FileSystem from 'expo-file-system/legacy';
import { loadTensorflowModel, TensorflowModel } from 'react-native-fast-tflite';

let cachedModel: TensorflowModel | null = null;

const MODEL_URL = 'https://drive.google.com/uc?export=download&id=1foHD_SxldpCD7kwwPOrn_51UwWBzCJUW';
const MODEL_PATH = FileSystem.documentDirectory + 'csrnet.tflite';

const getModel = async (): Promise<TensorflowModel> => {
    if (cachedModel) return cachedModel;

    const info = await FileSystem.getInfoAsync(MODEL_PATH);
    if (!info.exists) {
        console.log('Downloading model...');
        await FileSystem.downloadAsync(MODEL_URL, MODEL_PATH);
        console.log('Model downloaded!');
    }

    cachedModel = await loadTensorflowModel({ url: MODEL_PATH });
    return cachedModel;
};

const loadRawPixels = async (base64: string): Promise<Float32Array> => {
    const data = Skia.Data.fromBase64(base64);
    const skImage = Skia.Image.MakeImageFromEncoded(data);
    if (!skImage) throw new Error('Failed to decode image');

    const pixels = skImage.readPixels(0, 0, {
        width: 252,
        height: 252,
        colorType: ColorType.RGBA_8888,
        alphaType: AlphaType.Unpremul,
    });
    if (!pixels) throw new Error('Failed to read pixels');

    const float32 = new Float32Array(252 * 252 * 3);
    let floatIdx = 0;
    for (let i = 0; i < 252 * 252; i++) {
        float32[floatIdx++] = pixels[i * 4 + 0] / 255.0; // R
        float32[floatIdx++] = pixels[i * 4 + 1] / 255.0; // G
        float32[floatIdx++] = pixels[i * 4 + 2] / 255.0; // B
    }
    return float32;
};

const normalizeDensityMap = (flatDensityMap: Float32Array): Float32Array => {
    const max = Math.max(...flatDensityMap);
    const min = Math.min(...flatDensityMap);
    const range = max - min || 1;
    return flatDensityMap.map((v) => (v - min) / range);
};

export const predictFromBase64 = async (base64: string) => {
    try {
        const model = await getModel();
        const float32 = await loadRawPixels(base64);

        const output = await model.run([float32]);
        const flatDensityMap = output[0] as Float32Array;

        const mapWidth = Math.floor(252 / 8);
        const mapHeight = Math.floor(252 / 8);

        const predictedCount = flatDensityMap.reduce((a, b) => a + b, 0);
        const normalizedMap = normalizeDensityMap(flatDensityMap);

        console.log('Predicted Count:', predictedCount);

        return { predictedCount, normalizedMap, mapWidth, mapHeight };
    } catch (error) {
        console.error(error);
    }
};
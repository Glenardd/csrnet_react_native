import { AlphaType, Canvas, ColorType, Image, Skia } from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';

interface DensityMapProps {
    normalizedMap: Float32Array;
    mapWidth: number;
    mapHeight: number;
    displaySize?: number;
}

const heatmapRGB = (value: number): [number, number, number] => {
    let r = 0, g = 0, b = 0;
    if (value < 0.25) {
        b = 255; g = Math.round((value / 0.25) * 255);
    } else if (value < 0.5) {
        g = 255; b = Math.round(((0.5 - value) / 0.25) * 255);
    } else if (value < 0.75) {
        g = 255; r = Math.round(((value - 0.5) / 0.25) * 255);
    } else {
        r = 255; g = Math.round(((1.0 - value) / 0.25) * 255);
    }
    return [r, g, b];
};

function DensityMap({ normalizedMap, mapWidth, mapHeight, displaySize = 252 }: DensityMapProps) {
    const image = useMemo(() => {
        const pixels = new Uint8Array(mapWidth * mapHeight * 4);
        
        for (let i = 0; i < normalizedMap.length; i++) {
            const v = normalizedMap[i];
            const [r, g, b] = heatmapRGB(v);
            pixels[i * 4 + 0] = r;
            pixels[i * 4 + 1] = g;
            pixels[i * 4 + 2] = b;
            pixels[i * 4 + 3] = 255;
        }

        const data = Skia.Data.fromBytes(pixels);
        return Skia.Image.MakeImage(
            { width: mapWidth, height: mapHeight, alphaType: AlphaType.Opaque, colorType: ColorType.RGBA_8888 },
            data,
            mapWidth * 4
        );
    }, [normalizedMap, mapWidth, mapHeight]);

    if (!image) return null;

    return (
        <Canvas style={{ width: displaySize, height: displaySize }}>
            <Image image={image} x={0} y={0} width={displaySize} height={displaySize} fit="fill" />
        </Canvas>
    );
}

export default memo(DensityMap);
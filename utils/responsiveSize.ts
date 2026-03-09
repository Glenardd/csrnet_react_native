import { Dimensions } from "react-native";

const { width } = Dimensions.get("screen");

export const responsiveSize = (size: number) => {
    return (width / 360) * size
}

//size is padding in the left to right
export const widthPadding = (size: number) => {
    return  width - size * 2
}
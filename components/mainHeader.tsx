
import { responsiveSize } from "@/utils/responsiveSize";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

export default function MainHeader() {

  return (
    <View style={header.container}>
      <View style={{flexDirection:"row", alignItems:"center", gap:10}}>
        <Image source={require('@/assets/images/splashIcon.png')} style={{ height: responsiveSize(50), width: responsiveSize(50) }} />
        <Text style={header.title}>Micro-Detect</Text>
      </View>
    </View>
  )
}

const header = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color:"white"
  },
});
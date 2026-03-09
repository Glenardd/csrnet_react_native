import UploadImage from "@/components/uploadImage";
import { useAuthContext } from "@/hooks/use-auth-context";
import { responsiveSize } from "@/utils/responsiveSize";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {

  const styles = StyleSheet.create({
    container: {
      flex:1,
      alignItems:"center",
      justifyContent:"center",
      gap:responsiveSize(230)
    }
  })

  const { session } = useAuthContext()
  const username = session?.user.user_metadata?.name

  return (
    <View
      style={styles.container}
    >
      <View style={{justifyContent: "center", alignItems: 'center' }}>
        <Text style={{ fontSize: responsiveSize(30), color: "white" }}>{"Welcome "+username}</Text>
        <Text style={{ fontSize: responsiveSize(12), color: "white" }}>Press below to upload image</Text>
      </View>
      <UploadImage />
    </View>
  )
}
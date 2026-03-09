import BackgroundOverlay from '@/components/backgroundOverlay';
import GlobalSeparator from '@/components/globalSeparator';
import { getTest } from '@/services/test.service';
import { responsiveSize, widthPadding } from '@/utils/responsiveSize';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Records() {

  const [tests, setTests] = useState<any[]>([]);
  const [loadingTests, setLoadingTests] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchTests = async () => {
      setLoadingTests(true);
      const data = await getTest();
      setTests(data || []);
      setLoadingTests(false);
    };

    fetchTests();
  }, []);

  return (
    <View style={{ marginTop: 20, alignItems: "center" }}>
      <View style={styles.row}>
        <TextInput placeholder="Enter test name" style={styles.input} />
        <Pressable onPress={() => {
          console.log("added a project")
        }}>
          <MaterialIcons name="add-circle" size={responsiveSize(40)} color="white" />
        </Pressable>
      </View>
      <BackgroundOverlay height={420} width={30}>
        {loadingTests ? <View style={{justifyContent:"center", alignItems:"center", flex:1}}><Text>Loading...</Text></View> : (<FlatList
          data={tests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.listContainer}>
              <Pressable onPress={()=>{
                router.push({
                  pathname:"/category",
                  params: {test_id :item.id}
                });
              }}>
                <GlobalSeparator paddingHorizontal={20} paddingVertical={15}>
                  <Text>{item.test_name}</Text>
                </GlobalSeparator>
              </Pressable>
            </View>
          )}
          style={{ marginTop: 20 }}
        />)}
      </BackgroundOverlay>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    paddingVertical:8,
    paddingHorizontal:20,
  },
  input: {
    width: widthPadding(55),
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5
  }
});

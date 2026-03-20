import BackgroundOverlay from '@/components/backgroundOverlay';
import LoadingScreen from '@/components/loadingScreen';
import ScrollableTest from '@/components/scrollabeTest';
import { createTest, deleteTest, getCurrentUser, getTest } from '@/services/test.service';
import { GetTestTypes } from '@/utils/dataTypes';
import { responsiveSize, widthPadding } from '@/utils/responsiveSize';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function Records() {

  const [tests, setTests] = useState<GetTestTypes[]>([]);
  const [loadingTests, setLoadingTests] = useState<true | false>(false);
  const [input, setInput] = useState<string>('')
  const [isLoadingInsert, setIsLoadingInsert] = useState<boolean>(false);
  const [isEmpty, setIsEmpty] = useState<boolean>(false);

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

  //insert a test
  const handleCreate = async () => {
    if (!input.trim()) {
      setIsEmpty(true)
      return
    }

    // close keyboard after submit
    Keyboard.dismiss()

    setIsLoadingInsert(true)

    try {
      const user = await getCurrentUser();

      await createTest({
        test_name: input,
        user_id: user?.id || ""
      });

      //clear  input after submission
      setInput('')

      const data = await getTest();
      setTests(data || []);

    } catch (error) {
      console.error("Failed to create test", error);
    }

    setIsLoadingInsert(false);
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteTest(id);

      setTests(prev => prev.filter(test => test.id !== id));
    } catch (error) {
      console.error("Failed to delete test", error);
    }
  };

  return (
    <View style={{ marginTop: 20, alignItems: "center" }}>
      <View style={styles.row}>
        <TextInput
          placeholder="Enter test name"
          placeholderTextColor={isEmpty ? "red" : "white"}
          style={[styles.input, isEmpty ? { borderColor: "red" } : ""]}
          onChangeText={(text) => {
            setInput(text)
            if (!text.trim()) setIsEmpty(true)
            setIsEmpty(false)
          }}
          value={input}
        />
        <Pressable onPress={handleCreate}>
          <MaterialIcons name="add-circle" size={responsiveSize(40)} color="white" />
        </Pressable>
      </View>
      <BackgroundOverlay height={410} width={30}>
        {loadingTests ? <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}><Text>Loading...</Text></View> : (
          <ScrollableTest data={tests} centered={true} scrollHeight={380} marginVertical={15} onDelete={handleDelete} />
        )}
      </BackgroundOverlay>
      <LoadingScreen isLoading={isLoadingInsert} message="Processing..." />
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
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  input: {
    width: widthPadding(55),
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffffffff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    color: "white"
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5
  }
});

import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useTasks } from "./TaskContext";
import Feather from "@expo/vector-icons/Feather";

export default function DetailScreen() {
  const { title, text, img, index, priority } = useLocalSearchParams();
  // const [description, setDescription] = useState(text);
  const navigation = useNavigation();
  const { setTasks } = useTasks();
  console.log("detailimg", img);

  useEffect(
    () =>
      navigation.setOptions({
        title,
        headerRight: () => (
          <FontAwesome5
            name="trash-alt"
            size={20}
            color="red"
            onPress={() => {
              setTasks((prevTasks) =>
                prevTasks.filter(
                  (task, taskIndex) => Number(taskIndex) !== Number(index)
                )
              );

              navigation.navigate("index", {
                title: "",
                text: "",
                img: null,
                priority: "",
              });
            }}
          />
        ),
      }),
    [navigation]
  );

  return (
    <View
      style={{
        padding: 15,
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "white",
      }}
    >
      <Text accessibilityHint="The body text of the note">{text}</Text>
      {img && (
        <Image
          accessible={true}
          accessibilityLabel="An image"
          accessibilityHint="The image that was added to the note by the user"
          accessibilityIgnoresInvertColors={true}
          source={{ uri: img }}
          style={{ height: "50%", width: "100%" }}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() =>
          navigation.navigate("edit", {
            oldTitle: title,
            oldText: text,
            oldImg: img,
            index,
            oldPriority: priority,
          })
        }
      >
        <Feather name="edit-3" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#369EF8",
    width: 60,
    height: 60,
    borderRadius: 50,
    position: "absolute",
    bottom: 20,
    right: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

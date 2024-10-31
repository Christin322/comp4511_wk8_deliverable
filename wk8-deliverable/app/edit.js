import {
  Image,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useTasks } from "./TaskContext";
export default function EditScreen() {
  const { oldTitle, oldText, oldImg, index, oldPriority } =
    useLocalSearchParams();

  const { setTasks } = useTasks();
  const [title, setTitle] = useState(oldTitle);
  const [text, setText] = useState(oldText);
  const [img, setImg] = useState(oldImg);
  const [priority, setPriority] = useState(oldPriority);

  const navigation = useNavigation();

  const [cameraPermissions] = ImagePicker.useCameraPermissions();
  const [mediaLibraryPermissions] = ImagePicker.useMediaLibraryPermissions();

  const checkPermissions = async () => {
    const cameraPermissions = await ImagePicker.requestCameraPermissionsAsync();
    const mediaLibraryPermissions =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!cameraPermissions.granted && !mediaLibraryPermissions.granted) {
      alert(
        "Please grant camera and/or media library permissions in settings."
      );
    }
  };

  // request permission if neccessary
  useEffect(() => {
    checkPermissions();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });
    if (!result.canceled) {
      setImg(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setImg(result.assets[0].uri);
    }
  };

  const updateTask = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task, taskIndex) =>
        Number(taskIndex) === Number(index)
          ? {
              title,
              text,
              img,
              priority,
            }
          : task
      )
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Title</Text>
      <TextInput
        accessibilityLabel="Title"
        accessibilityHint="The task's title"
        value={title}
        onChangeText={setTitle}
        placeholder={title}
        style={styles.textInput}
      />
      <Text style={styles.heading}>Description</Text>
      <TextInput
        accessibilityLabel="Description"
        accessibilityHint="The task's description"
        value={text}
        onChangeText={setText}
        placeholder={text}
        style={[styles.textInput, { height: 80, textAlignVertical: "top" }]}
        multiline={true}
      />
      <Text style={styles.heading}>Priority</Text>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          style={[
            priority === "Low"
              ? styles.priorityButtonSelected
              : styles.priorityButton,
            {
              backgroundColor: "#E9FAF5",
            },
          ]}
          onPress={() => setPriority("Low")}
        >
          <Text>Low</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            priority === "Medium"
              ? styles.priorityButtonSelected
              : styles.priorityButton,
            {
              backgroundColor: "#FEF5E1",
            },
          ]}
          onPress={() => setPriority("Medium")}
        >
          <Text>Medium</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            priority === "High"
              ? styles.priorityButtonSelected
              : styles.priorityButton,
            {
              backgroundColor: "#FFF5F8",
            },
          ]}
          onPress={() => setPriority("High")}
        >
          <Text>High</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.heading}>Image</Text>
      {img ? (
        <Image
          source={{ uri: img }}
          style={{
            height: 150,
            width: "100%",
            alignSelf: "center",
            borderRadius: 10,
          }}
        />
      ) : (
        <Text
          style={{
            width: "100%",
            height: 150,
            borderStyle: "dashed",
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 10,
            textAlign: "center",
            textAlignVertical: "center",
          }}
        >
          No image chosen
        </Text>
      )}
      <View style={{ flexDirection: "row", gap: 10 }}>
        {mediaLibraryPermissions?.granted && (
          <TouchableOpacity
            style={styles.photoButton}
            title="Pick an image"
            onPress={pickImage}
          >
            <Text style={styles.buttonText}>UPLOAD PHOTO</Text>
          </TouchableOpacity>
        )}
        {cameraPermissions?.granted && (
          <TouchableOpacity
            style={styles.photoButton}
            title="Take a photo"
            onPress={takePhoto}
          >
            <Text style={styles.buttonText}>TAKE PHOTO</Text>
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          updateTask();
          navigation.navigate("index");
        }}
      >
        <Text style={{ color: "white" }}>DONE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: "white",
    width: "100%",
    height: "100%",
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#369EF8",
  },
  photoButton: {
    flex: 1,
    padding: 15,
    borderColor: "#369EF8",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#369EF8",
    justifyContent: "center",
    alignItems: "center",
  },
  priorityButtonSelected: {
    flex: 1,
    padding: 15,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 18,
  },
  textInput: {
    backgroundColor: "#F7F7F7",
    padding: 10,
    borderRadius: 10,
  },
});

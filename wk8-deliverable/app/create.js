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
import { useNavigation } from "expo-router";
import * as ImagePicker from "expo-image-picker";

export default function CreateScreen() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [priority, setPriority] = useState("Low");

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
      console.log("print", result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync();
    if (!result.canceled) {
      setImg(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Title</Text>
      <TextInput
        accessibilityLabel="Title"
        accessibilityHint="The task's title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter title"
        style={styles.textInput}
      />
      <Text style={styles.heading}>Description</Text>
      <TextInput
        accessibilityLabel="Description"
        accessibilityHint="The task's description"
        value={text}
        onChangeText={setText}
        placeholder="Enter text"
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
        onPress={() =>
          navigation.navigate("index", { title, text, img, priority })
        }
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

import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTasks } from "./TaskContext";
// hardcoded unique key
const TASKS_STORE_KEY = "@tasks";

export default function Page() {
  // keep state at the top of ur component
  // const [tasks, setTasks] = useState([]);
  const { tasks, setTasks } = useTasks();
  const [filter, setFilter] = useState("All");

  const { title, text, img, priority } = useLocalSearchParams();

  useEffect(() => {
    // if theyre defined -> set them
    if (title && text) {
      setTasks((prevTask) => [
        ...prevTask,
        { title, text, img, done: false, priority },
      ]);
    }
  }, [title, text, img, priority]);

  // reading and writing data has side effects -> need a clean up function
  // reading tasks from the store on first render []
  useEffect(() => {
    // async to say returning a promise
    const getTasks = async () => {
      const storedTasks = await AsyncStorage.getItem(TASKS_STORE_KEY);
      // so if storedTasks is null it doesnt setTask
      storedTasks && setTasks(JSON.parse(storedTasks));
    };
    getTasks();
  }, []);

  // saving the tasks when state changes
  useEffect(() => {
    const saveTasks = async () => {
      await AsyncStorage.setItem(TASKS_STORE_KEY, JSON.stringify(tasks));
    };
    saveTasks();
    console.log("tasks", tasks);
  }, [tasks]);

  const navigation = useNavigation();

  const getPriorityBgColor = (priority) => {
    switch (priority) {
      case "High":
        return "#FFF5F8"; // Color for high priority
      case "Medium":
        return "#FEF5E1"; // Color for medium priority
      case "Low":
        return "#E9FAF5"; // Color for low priority
      default:
        return "white"; // Default color
    }
  };

  const getPriorityTextColor = (priority) => {
    switch (priority) {
      case "High":
        return "#F49FBA"; // Color for high priority
      case "Medium":
        return "#E5C072"; // Color for medium priority
      case "Low":
        return "#4FC1A1"; // Color for low priority
      default:
        return "black"; // Default color
    }
  };
  const checkTask = (index) => {
    setTasks((prevTasks) =>
      prevTasks.map((item, i) => (i === index ? { ...item, done: true } : item))
    );
    setTimeout(() => {
      // remove done task (returns false -> excluded from array)
      setTasks((prevTasks) => prevTasks.filter((task) => !task.done));
    }, 500);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <TouchableOpacity
          style={[
            filter === "All"
              ? styles.filterButtonSelected
              : styles.filterButton,
            {
              backgroundColor: "#C8E5FF",
            },
          ]}
          onPress={() => setFilter("All")}
        >
          <Text style={{ fontWeight: filter === "All" ? "bold" : "normal" }}>
            All
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            filter === "Low"
              ? styles.filterButtonSelected
              : styles.filterButton,
            {
              backgroundColor: "#E9FAF5",
            },
          ]}
          onPress={() => setFilter("Low")}
        >
          <Text style={{ fontWeight: filter === "Low" ? "bold" : "normal" }}>
            Low
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            filter === "Medium"
              ? styles.filterButtonSelected
              : styles.filterButton,
            {
              backgroundColor: "#FEF5E1",
            },
          ]}
          onPress={() => setFilter("Medium")}
        >
          <Text style={{ fontWeight: filter === "Medium" ? "bold" : "normal" }}>
            Medium
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            filter === "High"
              ? styles.filterButtonSelected
              : styles.filterButton,
            {
              backgroundColor: "#FFF5F8",
            },
          ]}
          onPress={() => setFilter("High")}
        >
          <Text style={{ fontWeight: filter === "High" ? "bold" : "normal" }}>
            High
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.taskContainer}>
        {tasks.length === 0 ? (
          <Text style={{ textAlign: "center" }}>You have no tasks</Text>
        ) : (
          tasks
            .filter((task) => task.priority === filter || filter === "All")
            .map(({ title, text, img, done, priority }, index) => (
              <TouchableOpacity
                style={[
                  styles.task,
                  { backgroundColor: getPriorityBgColor(priority) },
                ]}
                key={index + " " + title}
                onPress={() =>
                  navigation.navigate("detail", {
                    title,
                    text,
                    img,
                    index,
                    priority,
                  })
                }
              >
                <Pressable
                  onPress={() => checkTask(index)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? "black" : "white",
                    },
                    styles.checkbox,
                    done && styles.checkboxChecked,
                  ]}
                >
                  <FontAwesome name="check" size={16} color="white" />
                </Pressable>
                <View>
                  <Text style={{ color: getPriorityTextColor(priority) }}>
                    {priority} Priority
                  </Text>
                  <Text style={styles.title}>{title}</Text>
                </View>
                {/* <View style={styles.checkbox} onPre></View> */}
              </TouchableOpacity>
              // <Task title={title} text={text} img={img} />
              // <Text>{title}</Text>
            ))
        )}
      </ScrollView>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("create")}
      >
        <Ionicons name="add" size={30} color="white" />
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
    gap: 24,
  },
  // not working
  taskContainer: {
    // gap: 8,
    // display: "flex",
    // flexDirection: "column",
  },
  filterButton: {
    flex: 1,
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonSelected: {
    flex: 1,
    padding: 10,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    border: "solid",
    borderColor: "black",
    borderWidth: 1,
  },
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
  task: {
    padding: 15,
    backgroundColor: "white",
    marginBottom: 10,
    // borderWidth: 1,
    borderRadius: 15,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderRadius: 50,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "semibold",
  },
});

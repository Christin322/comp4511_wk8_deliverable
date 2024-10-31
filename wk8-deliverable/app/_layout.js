import { Stack } from "expo-router";
import { TaskProvider } from "./TaskContext";

export default function RootLayout() {
  return (
    // <Tabs screenOptions={{ headerShown: false }}>
    //   <Tabs.Screen
    //     name="list"
    //     options={{
    //       title: "Notes",
    //       //   tabBarIcon: ({ size, color }) => (
    //       //     <Ionicons name="document-text" size={size} color={color} />
    //       //   ),
    //     }}
    //   />
    // </Tabs>
    <TaskProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "To Do List 💜",
            headerStyle: {
              // backgroundColor: "black",
              fontSize: 24,
              fontWeight: "bold",
              // cant get rid of the ugly asf shadow
              // borderBottomWidth: 0,
              // elevation: 0,
            },

            headerTitleStyle: {
              fontSize: 24,
              fontWeight: "bold",
              color: "black",
            },
          }}
        />
        <Stack.Screen
          name="create"
          options={{ title: "Add Task", presentation: "modal" }}
        />
        <Stack.Screen
          name="edit"
          options={{ title: "Edit Task", presentation: "modal" }}
        />
      </Stack>
    </TaskProvider>
  );
}

import "react-native-gesture-handler";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import { LogBox } from "react-native";
import { Platform } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

if (Platform.OS === "android") LogBox.ignoreLogs(["Setting a timer"]);

const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#ffc629" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  headerTitleAlign: "center",
};

const HomeStackScreen = ({ navigation }) => {
  return (
    <HomeStack.Navigator screenOptions={globalScreenOptions}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="Chat" component={ChatScreen} />
      <HomeStack.Screen name="Login" component={LoginScreen} />
      <HomeStack.Screen name="Register" component={RegisterScreen} />
      <HomeStack.Screen name="NewChat" component={AddChatScreen} />
    </HomeStack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions={{ headerShown: false }}>
        <Drawer.Screen name="HomeDrawer" component={HomeStackScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

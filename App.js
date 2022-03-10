import "react-native-gesture-handler";
import React from "react";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import AddChatScreen from "./screens/AddChatScreen";
import ChatScreen from "./screens/ChatScreen";
import { LogBox } from "react-native";
import { Platform } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CallsScreen from "./screens/CallsScreen";
import ContactsScreen from "./screens/ContactsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import CustomDrawer from "./screens/CustomDrawer";
import { AntDesign, Feather } from "@expo/vector-icons";
import MyTabs from "./Components/MyTabs";

if (Platform.OS === "android") LogBox.ignoreLogs(["Setting a timer"]);

const HomeStack = createStackNavigator();
const Drawer = createDrawerNavigator();

const globalScreenOptions = {
  headerStyle: { backgroundColor: "#ffc629" },
  headerTitleStyle: { color: "white" },
  headerTintColor: "white",
  headerTitleAlign: "center",
};

const HomeDrawerScreen = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: true,

        drawerInactiveTintColor: "#333",
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 15,
        },
      }}
    >
      <Drawer.Screen
        name="HomeDrawer"
        component={MyTabs}
        options={{
          drawerIcon: ({ color }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Calls"
        component={CallsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Feather name="phone-call" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Contacts"
        component={ContactsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <AntDesign name="contacts" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color }) => (
            <AntDesign name="setting" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <HomeStack.Navigator screenOptions={globalScreenOptions}>
        <HomeStack.Screen name="Login" component={LoginScreen} />
        <HomeStack.Screen
          name="Home"
          component={HomeDrawerScreen}
          options={{ headerShown: false }}
        />
        <HomeStack.Screen name="Chat" component={ChatScreen} />
        <HomeStack.Screen name="Register" component={RegisterScreen} />
        <HomeStack.Screen name="NewChat" component={AddChatScreen} />
      </HomeStack.Navigator>
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

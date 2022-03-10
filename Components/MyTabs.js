import React, { useLayoutEffect } from "react";
import { View, TouchableOpacity } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import GroupScreen from "../screens/GroupScreen";

const Tab = createMaterialTopTabNavigator();

export default function MyTabs({ navigation }) {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chit-Chat",
      headerStyle: {
        backgroundColor: "#ffc629",
        borderBottomColor: "black",
        borderBottomWidth: 0,
        elevation: 0,
      },
      headerTitleStyle: { fontWeight: "600", fontSize: 25 },

      headerTitleAlign: "center",
      headerTintColor: "white",

      headerLeft: () => (
        <View
          style={{
            marginLeft: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: 57,
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <AntDesign name="menufold" size={26} color="black" />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: 57,
            marginRight: 15,
          }}
        >
          <TouchableOpacity activeOpacity={0.5}>
            <AntDesign name="search1" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("NewChat")}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="plus" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: "#ffc629" },
        tabBarIndicatorStyle: {
          backgroundColor: "rgb(242, 242, 242)",
          borderEndWidth: 35,
          borderEndColor: "#ffc629",
          borderStartWidth: 35,
          borderStartColor: "#ffc629",
          height: 3,
        },
        tabBarActiveTintColor: "white",
        tabBarLabelStyle: { fontSize: 15, fontWeight: "500" },
      }}
    >
      <Tab.Screen name="Chats" component={HomeScreen} />
      <Tab.Screen name="Groups" component={GroupScreen} />
    </Tab.Navigator>
  );
}

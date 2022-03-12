import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { auth } from "../firebase";

const CustomDrawer = (props) => {
  let path = auth?.currentUser?.photoURL;
  const name = auth?.currentUser?.displayName;

  const signOutUser = () => {
    if (Platform.OS == "web") {
      if (window.confirm("Are you sure you want to logout?")) {
        auth.signOut().then(() => {
          props.navigation.replace("Login");
        });
      }
    } else {
      Alert.alert("Logout?", "Are you sure you want to logout?", [
        {
          text: "Cancel",
          onPress: () => console.log("stay more"),
          style: "cancel",
        },
        {
          text: "Logout",
          onPress: () =>
            auth.signOut().then(() => {
              props.navigation.replace("Login");
            }),
        },
      ]);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <ImageBackground
          style={{
            padding: 20,
            alignItems: "center",
          }}
          source={require("../Image/background.png")}
        >
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate("Profile");
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Avatar
                rounded
                size={100}
                source={path ? { uri: path } : require("../Image/fake_img.jpg")}
                referrerPolicy="no-referrer"
              />
            </View>
            <Text
              style={{
                color: "#fff",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              {name ? name : "You don't have a nick name!"}
            </Text>
          </TouchableOpacity>
        </ImageBackground>

        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>

      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <AntDesign name="sharealt" size={24} color="black" />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
              }}
            >
              Invite
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={{ paddingVertical: 15 }} onPress={signOutUser}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Octicons name="sign-out" size={24} color="black" />
            <Text
              style={{
                fontSize: 15,
                marginLeft: 5,
              }}
            >
              Sign out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});

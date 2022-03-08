import React, { useEffect, useLayoutEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  View,
  TouchableOpacity,
} from "react-native";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { auth, db } from "../firebase";
import IndividualChat from "../Components/IndividualChat";

const HomeScreen = ({ navigation }) => {
  const [chats, setChats] = useState([]);

  const signOutUser = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };

  useEffect(() => {
    const unsubscribe = db.collection("chats").onSnapshot((snapshot) =>
      setChats(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      )
    );
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chit-Chat",
      headerStyle: { backgroundColor: "#fff" },
      headerTitleStyle: { color: "black" },
      headerTintColor: "black",
      headerLeft: () => (
        <View
          style={{
            marginLeft: 10,
            flexDirection: "row",
            alignItems: "center",
            //justifyContent: "space-between",
            width: 57,
          }}
        >
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <AntDesign name="menufold" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={signOutUser}>
            <Avatar
              rounded
              size={50}
              source={{ uri: auth?.currentUser?.photoURL }}
            />
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
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("NewChat")}
            activeOpacity={0.5}
          >
            <SimpleLineIcons name="plus" size={21} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterIntoChat = (id, chatName) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      <StatusBar style="auto" />
      <ScrollView style={styles.container}>
        {chats.map(({ id, data: { chatName } }) => (
          <IndividualChat
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterIntoChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { height: "100%" },
});

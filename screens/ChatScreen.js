import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Dimensions,
  KeyboardAvoidingView,
  SafeAreaView,
  Platform,
  ScrollView,
  TextInput,
  Keyboard,
} from "react-native";
import { Avatar } from "react-native-elements";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { firebase } from "@firebase/app";
import { db, auth } from "../firebase";

const ChatScreen = ({ navigation, route }) => {
  const [popup, setPopup] = useState(false);

  const [input, setInput] = useState("");

  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    if (input === "") return;
    //Keyboard.dismiss();
    db.collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        message: input,
        displayName: auth.currentUser.displayName,
        email: auth.currentUser.email,
        photoURL: auth.currentUser.photoURL,
      })
      .then(() => {
        setInput("");
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Unknown",
      headerTitleAlign: "left",
      headerBackTitleVissible: false,
      headerTitle: () => (
        <View>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Avatar rounded source={require("../Image/fake_img.jpg")} />
            <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
              {route.params.chatName}
            </Text>
          </TouchableOpacity>
        </View>
      ),

      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10, marginRight: -8 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 100,
            marginRight: 10,
          }}
        >
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={22} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setPopup(true)}>
            <SimpleLineIcons name="options-vertical" size={22} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(route.params.id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        )
      );

    return unsubscribe;
  }, [route]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="auto" />

      <Modal transparent visible={popup}>
        <TouchableOpacity activeOpacity={1} onPressOut={() => setPopup(false)}>
          <View style={{ width: "100%", height: "100%" }}>
            <View
              style={{
                width: Dimensions.get("window").width * 0.45,
                height: Dimensions.get("window").height * 0.25,
                backgroundColor: "#fff",
                padding: 10,
                marginTop: 20,
                marginRight: 10,
                borderRadius: 25,
                alignSelf: "flex-end",
                borderColor: "grey",
                borderWidth: 1,
              }}
            >
              <View style={styles.container}>
                <Text style={styles.textFirst}>New group</Text>
              </View>
              <View style={styles.container}>
                <Text style={styles.text}>New broadcast</Text>
              </View>
              <View style={styles.container}>
                <Text style={styles.text}>Linked devices</Text>
              </View>
              <View style={styles.container}>
                <Text style={styles.text}>Payment</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.board}
        keyboardVerticalOffset={85}
      >
        <>
          <ScrollView contentContainerStyle={{ padding: 5 }}>
            {messages.map(({ id, data }) =>
              data.email === auth.currentUser.email ? (
                <View key={id} style={styles.reciever}>
                  <Avatar
                    position="absolute"
                    rounded
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      right: -5,
                    }}
                    size={30}
                    bottom={-12}
                    right={-10}
                    source={{ uri: data.photoURL }}
                  />
                  <Text style={styles.recieverText}>{data.message}</Text>
                </View>
              ) : (
                <View key={id} style={styles.sender}>
                  <Avatar
                    position="absolute"
                    rounded
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      left: -5,
                    }}
                    size={30}
                    bottom={-15}
                    left={-1}
                    source={{ uri: data.photoURL }}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                  <Text style={styles.senderName}>{data.displayName}</Text>
                </View>
              )
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TextInput
              value={input}
              placeholder="Message"
              multiline
              style={styles.textInput}
              onSubmitEditing={sendMessage}
              onChangeText={(text) => setInput(text)}
            />
            <TouchableOpacity activeOpacity={0.5} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#ffc629" />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  textFirst: { fontSize: 20, marginTop: 15 },
  text: { fontSize: 20 },
  board: { flex: 1 },
  reciever: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  recieverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
  },
  sender: {
    padding: 15,
    backgroundColor: "#2B68E6",
    alignSelf: "flex-start",
    borderRadius: 20,
    margin: 15,
    maxWidth: "80%",
    position: "relative",
  },
  senderName: {
    left: 30,
    fontSize: 9,
    color: "black",
    bottom: -11,
    paddingRight: 30,
    position: "absolute",
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  textInput: {
    fontWeight: "normal",
    fontSize: 18,
    bottom: 0,
    minHeight: 45,
    flex: 1,
    marginRight: 10,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 10,
    borderRadius: 30,
  },
});

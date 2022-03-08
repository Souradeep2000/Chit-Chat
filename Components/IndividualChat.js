import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem, Avatar } from "react-native-elements";
import { db } from "../firebase";

const IndividualChat = ({ id, chatName, enterChat }) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("chats")
      .doc(id)
      .collection("messages")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) =>
        setChatMessages(snapshot.docs.map((doc) => doc.data()))
      );
    return unsubscribe;
  });
  return (
    <ListItem key={id} onPress={() => enterChat(id, chatName)} bottomDivider>
      {chatMessages?.[0]?.photoURL ? (
        <Avatar rounded source={{ uri: chatMessages?.[0]?.photoURL }} />
      ) : (
        <Avatar rounded source={require("../Image/fake_img.jpg")} />
      )}
      <ListItem.Content>
        <ListItem.Title style={{ fontWeight: "bold" }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0]?.displayName
            ? chatMessages?.[0]?.displayName + ": "
            : ""}
          {chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default IndividualChat;

const styles = StyleSheet.create({});

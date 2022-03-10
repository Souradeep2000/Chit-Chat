import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useLayoutEffect } from "react";
import { AntDesign } from "@expo/vector-icons";

const ContactsScreen = ({ navigation }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: "#ffc629" },
      headerTitleStyle: { color: "white" },
      headerTintColor: "white",
      headerTitleAlign: "center",

      headerLeft: () => (
        <TouchableOpacity
          style={{ marginLeft: 10, marginRight: -8 }}
          onPress={navigation.goBack}
        >
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View>
      <Text>ContactsScreen</Text>
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({});

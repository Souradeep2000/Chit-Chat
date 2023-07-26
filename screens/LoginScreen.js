import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { Button, Input, Image } from "react-native-elements";
import { StatusBar } from "expo-status-bar";
import { auth } from "../firebase";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    //let isValid = true;
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      //console.log(authUser);

      if (authUser) {
        navigation.replace("Home");
      }
    });

    return () => {
      unsubscribe;
    };
  }, []);

  const signIn = () => {
    auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err));
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require("../Image/download.jpg")}
        style={{
          width: 150,
          height: 150,
          borderWidth: 1,
          borderRadius: 100,
          borderColor: "grey",
        }}
      />
      <View style={styles.inputContainer}>
        <Input
          placeholder="admin@gmail.com"
          autoFocus
          type="email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="12345678"
          secureTextEntry
          type="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          onSubmitEditing={signIn}
        />
      </View>

      <Button containerStyle={styles.button} onPress={signIn} title="Login" />
      <Button
        containerStyle={styles.button}
        type={"outline"}
        title="Register"
        onPress={() => navigation.push("Register")}
      />
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputContainer: { width: 300, marginTop: 50 },
  button: { width: 200, marginTop: 10 },
});

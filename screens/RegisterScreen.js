import { StatusBar } from "expo-status-bar";
import React, { createRef, useLayoutEffect, useState } from "react";
import { Button, Input, Text } from "react-native-elements";
import {
  KeyboardAvoidingView,
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { firebase } from "@firebase/app";
import { auth, db, storage } from "../firebase";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import * as ImagePicker from "expo-image-picker";

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [image, setImage] = useState(null);
  const fake_img = require("../Image/fake_img.jpg");
  const [uploading, setUploading] = useState(false);
  const [transferred, setTransferred] = useState(0);

  const bs = createRef();
  const fall = new Animated.Value(1);

  const takePhotoFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your camera!");
      return;
    }

    await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
      .then((img) => {
        setImage(img.uri);
        //console.log(img.uri);
      })
      .catch((err) => console.log(err))
      .then(bs.current.snapTo(1));
  };

  const chooseFromFiles = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })
      .then((img) => {
        setImage(img.uri);
        //console.log(img.uri);
      })
      .catch((err) => console.log(err))
      .then(bs.current.snapTo(1));
  };

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose your profile Picture</Text>
      </View>

      <TouchableOpacity
        style={styles.panelButton}
        onPress={takePhotoFromCamera}
      >
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.panelButton} onPress={chooseFromFiles}>
        <Text style={styles.panelButtonTitle}>Choose from your files</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.panelButton}
        onPress={() => bs.current.snapTo(1)}
      >
        <Text style={styles.panelButtonTitle}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}></View>
      </View>
    </View>
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitle: "Login",
    });
  }, [navigation]);

  const register = () => {
    if (password !== confirmPassword) {
      alert("password does not match ");
      return;
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (authUser) => {
        const uri = await generateURL();
        //console.log(uri);

        authUser.user.updateProfile({
          displayName: name,
          photoURL: uri === null ? fake_img : uri,
        });

        db.collection("users")
          .doc(auth.currentUser.uid)
          .set({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            userImg: uri ? uri : null,
            name: name,
            email: email,
            phNo: "",
          });
      })
      .catch((error) => alert(error.message));
  };

  const generateURL = async () => {
    if (image === null) return null;

    const uploadUri = image;

    let fileName = uploadUri.substring(uploadUri.lastIndexOf("/") + 1);
    const extension = fileName.split(".").pop();
    const name = fileName.split(".").slice(0, -1).join(".");
    fileName = name + Date.now() + "." + extension;

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.onerror = function () {
        reject(new TypeError("Network request failed"));
      };

      xhr.responseType = "blob";
      xhr.open("GET", image, true);
      xhr.send(null);
    });

    setUploading(true);

    const task = storage.ref(`photos/${fileName}`).put(blob);
    // .putString(uploadUri, "data_url", { contentType: "image/jpg" });

    task.on(
      "state_changed",
      (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        alert(error);
      }
    );

    try {
      await task;
      setUploading(false);

      const uri = await task.snapshot.ref.getDownloadURL();
      return uri;
    } catch (e) {
      alert(e);
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bs}
        renderHeader={renderHeader}
        renderContent={renderInner}
        snapPoints={[330, 0]}
        initialSnap={1}
        callbackNode={fall}
        enabledGestureInteraction={true}
        enabledContentTapInteraction={false}
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
          alignItems: "center",
        }}
      >
        <StatusBar style="auto" />

        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
            <View
              style={{
                height: 150,
                width: 150,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ImageBackground
                source={
                  //{ uri: image }
                  image ? { uri: image } : require("../Image/background.png")
                }
                style={{ height: 150, width: 150 }}
                imageStyle={{ borderRadius: 15 }}
              >
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Feather
                    name="camera"
                    size={35}
                    color="#fff"
                    style={{
                      opacity: 0.7,
                      alignItems: "center",
                      justifyContent: "center",
                      borderWidth: 1,
                      borderColor: "#fff",
                      borderRadius: 10,
                    }}
                  />
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <ScrollView>
            <Input
              placeholder="User Name"
              autoFocus
              type="text"
              value={name}
              onChangeText={(text) => setName(text)}
            />

            <Input
              placeholder="Email"
              type="text"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Input
              placeholder="Password"
              secureTextEntry
              type="password"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
            <Input
              placeholder="Confirm Password"
              secureTextEntry
              type="password"
              value={confirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
            />
          </ScrollView>
        </View>

        <Button
          containerStyle={styles.button}
          raised
          onPress={register}
          title="Register"
        />
      </Animated.View>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  inputContainer: { width: 300 },
  button: { width: 200, marginTop: 10 },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: "rgb(32, 137, 220)",
    alignItems: "center",
    marginVertical: 7,
  },
  panel: {
    padding: 20,
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "white",
  },
});

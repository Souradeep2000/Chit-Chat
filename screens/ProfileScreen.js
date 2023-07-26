import "react-native-gesture-handler";
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import React, { createRef, useEffect, useState } from "react";
import {
  Feather,
  EvilIcons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { auth, db, storage } from "../firebase";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = () => {
  const [userData, setUserData] = useState(null);
  const getUser = async () => {
    const currentUser = await db
      .collection("users")
      .doc(auth.currentUser.uid)
      .get()
      .then((documentSnapshot) => {
        if (documentSnapshot.exists) {
          setUserData(documentSnapshot.data());
        }
      });
  };

  const x = auth?.currentUser?.photoURL;
  const [image, setImage] = useState(x);
  const y = auth?.currentUser?.displayName;
  const [name, setName] = useState(y);
  //const [enable, setEnable] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [ph, setPh] = useState("");

  const bs = createRef();
  const fall = new Animated.Value(1);

  const takePhotoFromCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("You've refused to allow this appp to access your camera!");
      return;
    }

    await ImagePicker.launchCameraAsync()
      .then((img) => {
        setImage(img.uri);
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
    await ImagePicker.launchImageLibraryAsync()
      .then((img) => {
        setImage(img.uri);
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
        onPress={() => {
          bs.current.snapTo(1);
        }}
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

  const handleUpdate = async () => {
    if (image !== x) {
      let imgURL = await generateURL();
      if (imgURL !== null) {
        db.collection("users")
          .doc(auth.currentUser.uid)
          .update({ userImg: imgURL })
          .then(auth.currentUser.updateProfile({ photoURL: imgURL }));
      }
    }

    if (name !== y && name.length > 0) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({ name: name })
        .then(auth.currentUser.updateProfile({ displayName: name }));
    }

    if (ph.length == 10) {
      db.collection("users")
        .doc(auth.currentUser.uid)
        .update({ phNo: ph })
        .then(alert("phone number updated"));
    }

    alert("updated");
  };

  const generateURL = async () => {
    if (image === x) return null;

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

  useEffect(() => {
    getUser();
  }, []);

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
        }}
        // pointerEvents={enable ? "none" : "auto"}
      >
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => {
              bs.current.snapTo(0);
            }}
          >
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

          <Text style={{ marginTop: 10, fontSize: 18, fontWeight: "bold" }}>
            {name ? name : "---"}
          </Text>
        </View>

        <View style={styles.action}>
          <EvilIcons name="user" size={30} color="black" />
          <TextInput
            placeholder={name}
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>

        <View style={styles.action}>
          <AntDesign name="phone" size={30} color="black" />
          <TextInput
            placeholder={userData ? userData.phNo : "Add ph no"}
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={styles.textInput}
            value={ph}
            onChangeText={(text) => setPh(text)}
          />
        </View>

        <TouchableOpacity style={styles.commandButton} onPress={handleUpdate}>
          <Text style={styles.panelButtonTitle}>Update</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  action: {
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "center",
    margin: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 10,
  },
  commandButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "rgb(32, 137, 220)",
    alignItems: "center",
    marginTop: 10,
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
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    marginLeft: 5,
    paddingLeft: 10,
    color: "#05375a",
  },
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
});

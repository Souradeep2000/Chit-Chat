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
import React, { useState } from "react";
import {
  Feather,
  EvilIcons,
  MaterialIcons,
  AntDesign,
} from "@expo/vector-icons";
import { auth } from "../firebase";
import Animated from "react-native-reanimated";
import BottomSheet from "reanimated-bottom-sheet";

const ProfileScreen = () => {
  const name = auth?.currentUser?.displayName;
  const [enable, setEnable] = useState(false);

  const bs = React.createRef();
  const fall = new Animated.Value(1);

  const renderInner = () => (
    <View style={styles.panel}>
      <View style={{ alignItems: "center" }}>
        <Text style={styles.panelTitle}>Upload Photo</Text>
        <Text style={styles.panelSubtitle}>Choose your profile Picture</Text>
      </View>

      <TouchableOpacity style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>Take Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.panelButton}>
        <Text style={styles.panelButtonTitle}>Choose from your files</Text>
      </TouchableOpacity>
      {Platform.OS == "web" ? (
        <TouchableOpacity
          style={styles.panelButton}
          onPress={() => bs.current.snapTo(1)}
        >
          <Text style={styles.panelButtonTitle}>Cancel</Text>
        </TouchableOpacity>
      ) : (
        <></>
      )}
    </View>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle}></View>
      </View>
    </View>
  );

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
      />
      <Animated.View
        style={{
          margin: 20,
          opacity: Animated.add(0.1, Animated.multiply(fall, 1.0)),
        }}
      >
        <View style={{ alignItems: "center" }}>
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
                source={require("../Image/background.png")}
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
          <EvilIcons
            name="user"
            size={45}
            color="black"
            onPress={() => {
              setEnable(true);
            }}
          />
          <TextInput
            placeholder={name}
            placeholderTextColor="#666666"
            autoCorrect={false}
            style={styles.textInput}
            editable={enable}
            selectTextOnFocus={enable}
          />
        </View>

        <View style={styles.action}>
          <MaterialIcons name="alternate-email" size={30} color="black" />
          <TextInput
            placeholder={auth?.currentUser?.email}
            placeholderTextColor="#666666"
            keyboardType="email-address"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>
        <View style={styles.action}>
          <AntDesign name="phone" size={30} color="black" />
          <TextInput
            placeholder="Phone Number"
            placeholderTextColor="#666666"
            keyboardType="number-pad"
            autoCorrect={false}
            style={styles.textInput}
          />
        </View>

        <TouchableOpacity style={styles.commandButton} onPress={() => {}}>
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

import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ToastAndroid,
} from "react-native";

const EmailVerificationScreen = ({ navigation, route }) => {
  const [code, setCode] = useState("");
  const saveCode = (text) => {
    setCode(text);
  };
  const verifyCode = () => {
    if (code.trim().length === 0) {
      ToastAndroid.show("Code can't be blank", ToastAndroid.SHORT);
      return;
    }

    const requestOption = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: route.params.username,
        code: code,
      }),
    };

    fetch(
      "http://siprojekat.duckdns.org:5051/api/Register/confirm/phone",
      requestOption
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        if (data.message != "Username or code incorrect!") {
          navigation.navigate("Home");
          ToastAndroid.show(JSON.stringify(data.message), ToastAndroid.SHORT);
          console.log(JSON.stringify(data));
        } else {
          ToastAndroid.show(JSON.stringify(data.message), ToastAndroid.SHORT);
        }
      })
      .catch((err) => {
        ToastAndroid.show(err.message, ToastAndroid.SHORT);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.title}>Verify-code</Text>
        <Text style={styles.bodyText}>
          Enter the confirmation code sent to your phone numbers to complete the
          verification.
        </Text>
        <TextInput
          style={styles.inputText}
          placeholder="Enter code"
          placeholderTextColor={"#CADAFF73"}
          keyboardType="number-pad"
          onChangeText={(text) => {
            console.log(text);
            saveCode(text);
          }}
        />
        <Pressable
          style={styles.verifyButton}
          title="Verify"
          onPress={() => {
            verifyCode();
          }}
        >
          <Text style={styles.verifyText}>VERIFY</Text>
        </Pressable>

        <Pressable
          style={styles.resendCode}
          title="SendToPhone"
          onPress={() => {
            const requestOption = {
              method: "GET",
              headers: {
                accept: "text/plain",
                "Content-Type": "application/json",
              },
            };
            console.log("Username: " + route.params.username);
            fetch(
              "http://siprojekat.duckdns.org:5051/api/Register/phone?username=" +
                route.params.username,
              requestOption
            )
              .then((response) => {
                return response.json();
              })
              .then((data) => {
                ToastAndroid.show(
                  JSON.stringify(data.message),
                  ToastAndroid.SHORT
                );
                console.log(JSON.stringify(data));
              })
              .catch((err) => {
                console.log(err.message);
              });
          }}
        >
          <Text style={styles.resendCode}> Resend </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1B1938",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    height: "45%",
    backgroundColor: "#312D65",
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#645CD1",
  },
  title: {
    color: "#FFFFFF78",
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    marginBottom: 25,
  },
  bodyText: {
    color: "#CADAFFBF",
    fontSize: 18,
    display: "flex",
    textAlign: "center",
    paddingHorizontal: 32,
  },
  inputText: {
    backgroundColor: "#23204D",
    color: "#ffffff",
    width: "78%",
    height: 45,
    textAlign: "center",
    borderRadius: 20,
    marginTop: 25,
    fontSize: 18,
  },
  verifyButton: {
    marginTop: 13,
    backgroundColor: "#FFC022",
    width: 120,
    height: 35,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  verifyText: {
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 1,
  },

  resendCode: {
    color: "#00D8FF",
    fontSize: 14,
    marginTop: 7,
    letterSpacing: 1,
  },
});

export default EmailVerificationScreen;

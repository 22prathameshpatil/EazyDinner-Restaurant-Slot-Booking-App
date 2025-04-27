import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import easydinnerlogo from "../../assets/images/easydinnerlogo.png";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userData = {
        displayName: user.displayName,
        uid: user.uid,
        email: user.email,
      };
      
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      await AsyncStorage.setItem("isGuest", "false");

      setEmail("");
      setPassword("");

      router.replace("/home");
    } catch (error) {
      if (error.code === "auth/invalid-email") {
        Alert.alert(
          "Sign In Failed!",
          "No user found with this email address. Please check or Sign Up first.",
          [{ text: "OK" }]
        );
      } else if (error.code === "auth/invalid-credential") {
        Alert.alert(
          "Sign In Failed!",
          "Incorrect password. Please try again.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Sign In Error",
          "An unexpected error occurred. Please try again later.",
          [{ text: "OK" }]
        );
      }
    }
  };

  return (
    <SafeAreaView className="bg-stone-800 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 m-2 items-center justify-evenly">
          <Image source={easydinnerlogo} style={{ width: 200, height: 150 }} />

          <View className="w-5/6 mt-4">
            <Text className="text-center text-xl font-bold text-white">
              Welcome Back!
            </Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#555"
              value={email}
              onChangeText={setEmail}
              className="bg-white rounded-lg p-2 my-2"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#555"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="bg-white rounded-lg p-2 my-2"
            />

            <TouchableOpacity
              onPress={handleSignIn}
              className="bg-orange-500 p-2 my-2 rounded-xl shadow-md active:opacity-80"
            >
              <Text className="text-center text-black font-bold text-lg">
                Sign In
              </Text>
            </TouchableOpacity>

            <View className="my-2 border-t border-white" />

            <View className="flex-row justify-center items-center mt-2">
              <Text className="text-white mr-1 text-base">
                Don’t have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text className="text-orange-500 underline font-semibold text-lg">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

           
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

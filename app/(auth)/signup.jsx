import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import easydinnerlogo from "../../assets/images/easydinnerlogo.png";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { getFirestore, setDoc, doc } from "firebase/firestore";

const Signup = () => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();
  const db = getFirestore();

  const handleGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      router.push("/signin");

      await setDoc(doc(db, "users", user.uid), {
        email: email,
        createdAt: new Date(),
      });

      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Signup Failed!",
          "This email address is already in use. Please use a different email.",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Signup Error",
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
            <Text className="text-center text-white text-xl font-bold my-2">
              Let's get you started
            </Text>

            <TextInput
              placeholder="Name"
              placeholderTextColor="#555555"
              value={name}
              onChangeText={setName}
              className="bg-white rounded-lg p-2 my-2"
            />

            <TextInput
              placeholder="Email"
              placeholderTextColor="#555555"
              value={email}
              onChangeText={setEmail}
              className="bg-white rounded-lg p-2 my-2"
            />

            <TextInput
              placeholder="Password"
              placeholderTextColor="#555555"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              className="bg-white rounded-lg p-2 my-2"
            />

            <TouchableOpacity
              onPress={handleSignUp}
              className="bg-orange-500 p-2 my-2 rounded-xl shadow-md active:opacity-80"
            >
              <Text className="text-center text-black font-bold text-lg">
                Sign Up
              </Text>
            </TouchableOpacity>

            <View className="my-2 border-t border-white" />

            <View className="flex-row justify-center items-center mt-2 ">
              <Text className="text-white mr-1 text-base">
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push("/signin")}>
                <Text className="text-orange-500 font-semibold underline text-base">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>

            <View className="my-2 border-t border-white" />

            <View className="flex-row justify-center items-center mt-2">
              <Text className="text-white mr-1 text-lg">Be a </Text>
              <TouchableOpacity onPress={handleGuest}>
                <Text className="text-orange-500 underline font-semibold text-lg">
                  Guest User
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;

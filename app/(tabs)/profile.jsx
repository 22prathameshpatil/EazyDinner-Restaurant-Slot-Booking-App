import { View, Text, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { getAuth, signOut } from "firebase/auth";

export default function Profile() {
  const router = useRouter();
  const auth = getAuth();
  const [userEmail, setUserEmail] = useState(null);
  const [userName, setUserName] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  const fetchUserData = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const guestFlag = await AsyncStorage.getItem("isGuest");

      const userObject = storedUser ? JSON.parse(storedUser) : null;
      if (userObject) {
        setUserEmail(userObject.email);
        setUserName(userObject.displayName);
      }

      if (guestFlag === "true") {
        setIsGuest(true);
        setUserEmail("...");
        setUserName("Guest User");
      }
    } catch (error) {
      console.log("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const guestFlag = await AsyncStorage.getItem("isGuest");

      if (guestFlag === "true") {

        await AsyncStorage.removeItem("isGuest");
        await AsyncStorage.removeItem("user");
        setUserEmail(null);
        setUserName(null);
        setIsGuest(false);
        Alert.alert("Signed out", "Guest session ended.");
      } else {

        await signOut(auth);
        await AsyncStorage.removeItem("user");
        setUserEmail(null);
        setUserName(null);
        Alert.alert("Logged out", "You have been logged out successfully.");
      }

      router.replace("/signin");
    } catch (error) {
      console.log("Logout error:", error);
      Alert.alert("Logout Error", "Error while logging out");
    }
  };

  const handleSignup = () => {
    router.push("/signup");
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#2b2b2b]">
      <Text className="text-xl text-[#f49b33] font-semibold mb-4">
        User Profile
      </Text>

      {userEmail && userName ? (
        <>
          <Text className="text-white text-lg mb-6">Name: {userName}</Text>
          <Text className="text-white text-lg mb-6">Email: {userEmail}</Text>

          <TouchableOpacity
            onPress={handleLogout}
            className="p-2 my-2 bg-[#f49b33] rounded-lg mt-10"
          >
            <Text className="text-lg font-semibold text-center text-black">
              {isGuest ? "End Guest Session" : "Logout"}
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            onPress={handleSignup}
            className="p-2 my-2 bg-[#f49b33] rounded-lg mt-10"
          >
            <Text className="text-lg font-semibold text-center text-black">
              Sign Up
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

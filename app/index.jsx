import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import easydinnerlogo from "../assets/images/easydinnerlogo.png";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const handleGuest = async () => {
    await AsyncStorage.setItem("isGuest", "true");
    router.push("/home");
  };

  const handleUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");
      const userObject = storedUser ? JSON.parse(storedUser) : null;
      const isGuest = await AsyncStorage.getItem("isGuest");

      if (userObject) {
        router.replace("/home");
      } else if (isGuest === "true") {
        router.replace("/home");
      } else {
        setLoading(false); 
      }
    } catch (error) {
      console.error("Error checking user:", error);
      setLoading(false); 
    }
  };

  useEffect(() => {
    handleUser();
  }, []);

  if (loading) {
    return (
      <SafeAreaView className="bg-stone-800 flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FFA500" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-stone-800 flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 m-2 items-center justify-evenly">
          <Image source={easydinnerlogo} style={{ width: 200, height: 150 }} />
          <View className="w-3/4 mt-10">
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              className="bg-orange-500 p-2 my-2 rounded-xl shadow-md active:opacity-80"
            >
              <Text className="text-center text-black font-bold text-lg">
                Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleGuest}
              className="bg-orange-500 p-2 my-2 rounded-xl shadow-md active:opacity-80"
            >
              <Text className="text-center text-white font-bold text-lg">
                Guest User
              </Text>
            </TouchableOpacity>

            <View className="my-2 border-t border-white" />

            <View className="flex-row justify-center items-center mt-2 text-lg">
              <Text className="text-white text-base mr-1">Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push("/signin")}>
                <Text className="text-orange-500 underline text-lg">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

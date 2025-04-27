import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  Platform,
  TouchableNativeFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/Colors";
import { BlurView } from "expo-blur";
import homeBanner from "../../assets/images/homeBanner.png";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../config/firebaseConfig.js";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Touchable =
  Platform.OS === "android" ? TouchableNativeFeedback : TouchableOpacity;

const Home = () => {
  const router = useRouter();
  const [restaurants, setRestaurants] = useState([]);

  const temp = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    const isGuest = await AsyncStorage.getItem("isGuest");
    const userObject = storedUser ? JSON.parse(storedUser) : null;
  };

  const getRestaurants = async () => {
    try {
      const q = query(collection(db, "restaurants"));
      const res = await getDocs(q);

      res.forEach((item) => {
        setRestaurants((prev) => [...prev, item.data()]);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRestaurants();
    temp();
  }, []);

  const renderItem = ({ item }) => {
    return (
      <Touchable
        onPress={() => router.push(`/restaurant/${item.name}`)}
        background={
          Platform.OS === "android"
            ? TouchableNativeFeedback.Ripple("#ffffff20", false)
            : undefined
        }
      >
        <View
          className="bg-[#5f5f5f] max-h-64 max-w-64 flex justify-center rounded-lg p-4 mx-2 shadow-md"
          style={{ overflow: "hidden" }}
        >
          <Image
            resizeMode="cover"
            source={{ uri: item.image }}
            style={{ width: 180, height: 100, borderRadius: 10 }}
          />
          <Text className="text-white text-lg font-bold">{item.name}</Text>
          <Text className="text-white mb-1">{item.address}</Text>
          <Text className="text-white mb-1">
            Open: {item.opening} Close: {item.closing}
          </Text>
        </View>
      </Touchable>
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.SECONDARY, flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={{ alignItems: "center", marginVertical: 16 }}>
          <View
            style={{
              backgroundColor: "#5f5f5f",
              width: "90%",
              borderRadius: 12,
              padding: 12,
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Text style={{ color: "white", fontSize: 20, fontWeight: "600" }}>
              Welcome to{" "}
              <Text style={{ color: "#fbbf24", fontWeight: "bold" }}>
                EasyDiner
              </Text>
            </Text>
          </View>
        </View>

        <ImageBackground
          source={homeBanner}
          resizeMode="cover"
          style={{
            width: "100%",
            height: 100,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          <BlurView
            intensity={15}
            tint="dark"
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                color: "#ffee00",
                fontSize: 22,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Dine With Your Loved Ones
            </Text>
          </BlurView>
        </ImageBackground>

        <View className="p-2 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-2xl text-orange-500 font-semibold mr-2">
            Special Discount %
          </Text>
        </View>

        {restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ padding: 16 }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            className="flex-1"
          />
        ) : (
          <ActivityIndicator animating color={"#123456"} />
        )}

        <View className="p-2 bg-[#2b2b2b] flex-row items-center">
          <Text className="text-2xl text-orange-500 font-semibold mr-2">
            Our Restaurants
          </Text>
        </View>

        {restaurants.length > 0 ? (
          <FlatList
            data={restaurants}
            renderItem={renderItem}
            horizontal
            contentContainerStyle={{ padding: 16 }}
            showsHorizontalScrollIndicator={false}
            scrollEnabled={true}
            className="flex-1"
          />
        ) : (
          <ActivityIndicator animating color={"#123456"} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

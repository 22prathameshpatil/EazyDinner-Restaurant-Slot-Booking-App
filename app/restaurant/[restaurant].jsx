import {View,Text,ScrollView,FlatList,Dimensions,Image,Linking} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../assets/Colors";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import React, { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import DatePickerComponent from "../../components/restaurant/DatePickerComponent";
import GuestPickerComponent from "../../components/restaurant/GuestPickerComponent";
import FindSlots from "../../components/restaurant/FindSlots";

const Restaurant = () => {
  const { restaurant } = useLocalSearchParams();

  const flatListRef = useRef(null);
  const windowWidth = Dimensions.get("window").width;
  const [restaurantData, setRestaurantData] = useState({});
  const [carouselData, setCarouselData] = useState({});
  const [slotsData, setSlotsData] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [date, setDate] = useState(new Date());
  const [selectedNumber, setSelectedNumber] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleNextImage = () => {
    if (!carouselData[0]?.images?.length) return;

    const imagesLength = carouselData[0].images.length;
    const nextIndex = (currentIndex + 1) % imagesLength;
    setCurrentIndex(nextIndex);
    flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
  };

  const handlePrevImage = () => {
    if (!carouselData[0]?.images?.length) return;

    const imagesLength = carouselData[0].images.length;
    const prevIndex = (currentIndex - 1 + imagesLength) % imagesLength;

    setCurrentIndex(prevIndex);
    flatListRef.current.scrollToIndex({ index: prevIndex, animated: true });
  };

  const carouselItem = ({ item }) => {
    return (
      <View style={{ width: windowWidth - 2 }} className="h-58 relative">
        <View
          style={{
            position: "absolute",
            top: "40%",
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: 50,
            padding: 5,
            zIndex: 10,
            left: "2%",
          }}
        >
          <Ionicons
            onPress={handlePrevImage}
            name="arrow-back"
            size={24}
            color="white"
          />
        </View>

        <View
          style={{
            position: "absolute",
            top: "40%",
            backgroundColor: "rgba(0,0,0,0.7)",
            borderRadius: 50,
            padding: 5,
            zIndex: 10,
            right: "6%",
          }}
        >
          <Ionicons
            onPress={handleNextImage}
            name="arrow-forward"
            size={24}
            color="white"
          />
        </View>

        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            left: "50%",
            transform: [{ translateX: -50 }],
            zIndex: 10,
            bottom: 15,
          }}
        >
          {carouselData[0]?.images?.map((_, i) => (
            <View
              key={i}
              style={{
                backgroundColor: "white",
                marginHorizontal: 4,
                borderRadius: 999,
                height: i === currentIndex ? 12 : 7,
                width: i === currentIndex ? 12 : 7,
              }}
            />
          ))}
        </View>

        <Image
          source={{ uri: item }}
          style={{
            height: 180,
            borderRadius: 25,
            opacity: 0.5,
            backgroundColor: "black",
            marginRight: 20,
            marginLeft: 5,
          }}
        />
      </View>
    );
  };

  const getRestaurantData = async () => {
    try {
      const restaurantQuery = query(
        collection(db, "restaurants"),
        where("name", "==", restaurant)
      );
      const restaurantSnapshot = await getDocs(restaurantQuery);

      if (restaurantSnapshot.empty) {
        console.log("No matching restaurant data");
        return;
      }

      for (const doc of restaurantSnapshot.docs) {
        const restaurantData = doc.data();
        setRestaurantData(restaurantData);

        const carouselQuery = query(
          collection(db, "carousel"),
          where("res_id", "==", doc.ref)
        );

        const carouselSnapshot = await getDocs(carouselQuery);

        if (carouselSnapshot.empty) {
          console.log("No matching carousel data");
          return;
        }

        const carouselImages = [];
        carouselSnapshot.forEach((carouselDoc) => {
          carouselImages.push(carouselDoc.data());
        });

        setCarouselData(carouselImages);

        const slotsQuery = query(
          collection(db, "slots"),
          where("ref_id", "==", doc.ref)
        );
        const slotsSnapshot = await getDocs(slotsQuery);

        if (slotsSnapshot.empty) {
          console.log("No matching slots");
          return;
        }

        const slots = [];
        slotsSnapshot.forEach((slotDoc) => {
          slots.push(slotDoc.data());
        });

        setSlotsData(slots[0]?.slot);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLocation = async () => {
    const url = "https://maps.app.goo.gl/FcCLGWNEPy1UgsWb9";
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URL", url);
    }
  };

  useEffect(() => {
    getRestaurantData();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: Colors.SECONDARY, flex: 1 }}>
      <ScrollView className="h-full">
        <View className="flex-1 p-2">
          <Text className="text-xl text-orange-500 font-semibold ">
            {restaurant}
          </Text>

          <View className="my-2 border-t border-white" />
        </View>

        <View className="h-58 max-w-[98%] mx-2 rounded-[25px]">
          <FlatList
            ref={flatListRef}
            data={carouselData[0]?.images}
            renderItem={carouselItem}
            showsHorizontalScrollIndicator={false}
            horizontal
            scrollEnabled={false}
            style={{ borderRadius: 25 }}
          />
        </View>

        <View className="flex-1 flex-row p-2 m-2">
          <Ionicons name="location-sharp" size={24} color="#F97315" />
          <Text className="max-w-[75%] text-white">
            {restaurantData?.address} |{"  "}
            <Text
              onPress={handleLocation}
              className="underline flex items-center mt-1 text-[#F97315] italic font-semibold"
            >
              Get Direction
            </Text>
          </Text>
        </View>

        <View className="border m-2 p-1 border-[#F97315] rounded-lg">
          
          <View className="flex-1 border m-2 p-1 border-[#F97315] rounded-lg">
            <View className="flex-1 flex-row m-2  justify-end items-center">
              <View className="flex-1 flex-row">
                <Ionicons name="calendar" size={20} color="#F97315" />
                <Text className="text-white mx-2 text-base">
                  Select booking date
                </Text>
              </View>
              <DatePickerComponent date={date} setDate={setDate} />
            </View>
          </View>

          <View className="flex-1 flex-row bg-[#474747] rounded-lg  m-2 p-2 justify-end items-center">
            <View className="flex-1 flex-row">
              <Ionicons name="people" size={20} color="#f49b33" />
              <Text className="text-white mx-2 text-base">
                Select number of guests
              </Text>
            </View>
            <GuestPickerComponent
              selectedNumber={selectedNumber}
              setSelectedNumber={setSelectedNumber}
            />
          </View>
        </View>
        <View className="flex-1">
          <FindSlots
            restaurant={restaurant}
            date={date}
            selectedNumber={selectedNumber}
            slots={slotsData}
            selectedSlot={selectedSlot}
            setSelectedSlot={setSelectedSlot}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Restaurant;

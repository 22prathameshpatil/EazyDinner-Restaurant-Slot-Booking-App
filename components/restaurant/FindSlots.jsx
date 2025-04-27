import { View, Text, TouchableOpacity, Modal, TextInput, Alert } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import Ionicons from "@expo/vector-icons/Ionicons";

const FindSlots = ({
  date,
  selectedNumber,
  slots,
  selectedSlot,
  setSelectedSlot,
  restaurant,
}) => {
  const [slotsVisible, setSlotsVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePress = () => {
    setSlotsVisible(!slotsVisible);
  };

  const handleBooking = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    const guestStatus = await AsyncStorage.getItem("isGuest");
    const userObject = storedUser ? JSON.parse(storedUser) : null;

    if (userObject && userObject.email) {
      const userEmail = userObject.email;

      try {
        await addDoc(collection(db, "bookings"), {
          email: userEmail,
          slot: selectedSlot,
          date: date.toISOString(),
          guests: selectedNumber,
          restaurant: restaurant,
        });

        Alert.alert("Success", "Booking successfully Done!");
      } catch (error) {
        console.log(error);
      }
    } else if (guestStatus === "true") {
      setFormVisible(true);
      setModalVisible(true);
    } else {
      Alert.alert("Error", "Please sign in or continue as guest.");
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleSlotPress = (slot) => {
    let prevSlot = selectedSlot;
    if (prevSlot == slot) {
      setSelectedSlot(null);
    } else {
      setSelectedSlot(slot);
    }
  };

  const handleGuestFormSubmit = async () => {
    if (!fullName || !phoneNumber) {
      Alert.alert("Validation Error", "Please fill all fields.");
      return;
    }
    
    try {
      await addDoc(collection(db, "bookings"), {
        fullName: fullName,
        phoneNumber: phoneNumber,
        slot: selectedSlot,
        date: date.toISOString(),
        guests: selectedNumber,
        restaurant: restaurant,
      });

      Alert.alert("Success", "Booking successfully Done!");
      setModalVisible(false);
      setFullName('');    
      setPhoneNumber('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1">
      <View className={`flex ${selectedSlot != null && "flex-row"} `}>
        <View className={`${selectedSlot != null && "flex-1"}`}>
          <TouchableOpacity onPress={handlePress}>
            <Text className="text-center text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">
              Find Slots
            </Text>
          </TouchableOpacity>
        </View>
        {selectedSlot != null && (
          <View className="flex-1">
            <TouchableOpacity onPress={handleBooking}>
              <Text className="text-center text-white text-lg font-semibold bg-[#f49b33] p-2 my-3 mx-2 rounded-lg">
                Book Slot
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {slotsVisible && (
        <View className="flex-wrap flex-row mx-2 p-2 bg-[#474747] rounded-lg">
          {slots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              className={` m-2 p-4 bg-[#f49b33] rounded-lg items-center justify-center ${
                selectedSlot && selectedSlot !== slot ? "opacity-50" : ""
              }`}
              onPress={() => handleSlotPress(slot)}
              disabled={
                selectedSlot == slot || selectedSlot == null ? false : true
              }
            >
              <Text className="text-white font-bold">{slot}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 bg-[#00000080] justify-end">
          <View className="bg-[#474747] mx-4 rounded-t-lg p-4 pb-6">
            {formVisible && (
              <View className="w-full">
                <View>
                  <Ionicons
                    name="close-sharp"
                    size={30}
                    color={"#f49b33"}
                    onPress={handleCloseModal}
                  />
                </View>

                <Text className="text-[#f49b33] mt-4 mb-2">Name</Text>
                <TextInput
                  className="h-10 border border-white text-white rounded px-2"
                  placeholder="Enter full name"
                  placeholderTextColor="#aaa"
                  value={fullName}
                  onChangeText={setFullName}
                />

                <Text className="text-[#f49b33] mt-4 mb-2">Phone Number</Text>
                <TextInput
                  className="h-10 border border-white text-white rounded px-2"
                  placeholder="Enter phone number"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />

                <TouchableOpacity
                  onPress={handleGuestFormSubmit}
                  className="p-2 my-2 bg-[#f49b33] text-black rounded-lg mt-10"
                >
                  <Text className="text-lg font-semibold text-center">
                    Submit
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FindSlots;

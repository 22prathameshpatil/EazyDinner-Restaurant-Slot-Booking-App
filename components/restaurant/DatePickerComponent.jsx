import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

const DatePickerComponent = ({ date, setDate }) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(false);
    setDate(currentDate);
  };

  const handlePress = () => {
    setShow(true);
  };

  return (
    <View className="flex flex-row">
      <TouchableOpacity
        onPress={handlePress}
        className="rounded-lg px-2 py-1 justify-center bg-[#474747]"
      >
        <Text className="text-white">
          {date.toLocaleDateString()}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          accentColor="#f49b33"
          textColor="#f49b33"
          value={date}
          mode="date"
          onChange={onChange}
        display="calendar"
          minimumDate={new Date()}
          maximumDate={new Date(new Date().setDate(new Date().getDate() + 7))}
        />
      )}
    </View>
  );
};

export default DatePickerComponent;

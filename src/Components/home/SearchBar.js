import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { realtimeDb } from "../../../firebase";

export default function SearchBar({ cityHandler }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (text) => {
    setSearchQuery(text);

    try {
      const restaurantsRef = ref(realtimeDb, "restaurants");
      let querySnapshot;

      if (text.trim()) {
        const q = query(restaurantsRef, orderByChild("location/city"), equalTo(text));
        querySnapshot = await get(q);
      } else {
        querySnapshot = await get(restaurantsRef);
        cityHandler(""); // Show all restaurants when search is empty
        return;
      }

      const locations = [];
      querySnapshot.forEach((doc) => {
        locations.push(doc.val());
      });
      cityHandler(locations);
    } catch (error) {
      console.error("Error searching locations:", error);
    }
  };

  return (
    <View style={{ marginTop: 15, flexDirection: "row" }}>
      <View
        style={{
          backgroundColor: "#eee",
          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          marginRight: 10,
          flex: 1,
          padding: 10,
        }}
      >
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <Ionicons name="location-sharp" size={24} />
        </TouchableOpacity>
        <TextInput
          style={{
            backgroundColor: "#eee",
            borderRadius: 20,
            fontWeight: "700",
            flex: 1,
            marginLeft: 10,
            padding: 7,
          }}
          placeholder="Search Location"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
    </View>
  );
}
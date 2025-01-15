import React, { useState, useCallback } from "react";
import { View, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { realtimeDb } from "../../../firebase";
import debounce from "lodash.debounce";

export default function SearchBar({ cityHandler }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSearch = useCallback(
    debounce(async (text) => {
      setLoading(true);
      try {
        const restaurantsRef = ref(realtimeDb, "restaurants");
        let querySnapshot;

        if (text.trim()) {
          const q = query(restaurantsRef, orderByChild("location/city"), equalTo(text));
          querySnapshot = await get(q);
        } else {
          querySnapshot = await get(restaurantsRef);
          cityHandler(""); // Show all restaurants when search is empty
          setLoading(false);
          return;
        }

        const locations = [];
        querySnapshot.forEach((doc) => {
          locations.push(doc.val());
        });
        cityHandler(locations);
      } catch (error) {
        console.error("Error searching locations:", error);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleChangeText = (text) => {
    setSearchQuery(text);
    handleSearch(text);
  };

  return (
    <View style={{ marginTop: 15, flexDirection: "row" }}>
      <View
        style={{
          backgroundColor: "transparent",
          borderRadius: 50,
          flexDirection: "row",
          alignItems: "center",
          marginRight: 10,
          flex: 1,
          padding: 10, // Increased padding to make the box bigger
        }}
      >
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <Ionicons name="location-sharp" size={30} />
        </TouchableOpacity>
        <TextInput
          style={{
            backgroundColor: "white",
            borderRadius: 20,
            fontWeight: "700",
            flex: 1,
            marginLeft: 10,
            padding: 12, // Increased padding to make the input box bigger
          }}
          placeholder="Search Location"
          value={searchQuery}
          onChangeText={handleChangeText}
        />
        {loading && <ActivityIndicator size="small" color="#0000ff" style={{ marginLeft: 10 }} />}
      </View>
    </View>
  );
}
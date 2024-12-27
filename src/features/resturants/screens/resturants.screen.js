import React from "react";
import styled from "styled-components/native";
import {
  SafeAreaView,
  StatusBar as RNStatusBar,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { ResturantInfoCard } from "../components/resturant_info_card.component";

const SafeArea = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${Platform.OS === "android" ? RNStatusBar.currentHeight + "px" : 0};
`;

const SearchContainer = styled(View)`
  padding: 16px;
  background-color: white;
`;

const ResturantListContainer = styled(View)`
  flex: 1;
  padding: 16px;
  background-color: blue;
`;

export const ResturantsScreen = () => {
  const [search, setSearch] = React.useState("");

  return (
    <SafeArea>
      <SearchContainer>
        <Searchbar
          placeholder="Search"
          value={search}
          onChangeText={(text) => setSearch(text)} // Update state when text changes
        />
      </SearchContainer>

      <ResturantListContainer>
        <ResturantInfoCard />
      </ResturantListContainer>
    </SafeArea>
  );
};

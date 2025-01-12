import React, { useContext, useState } from "react";

import { FlatList, TouchableOpacity, TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";
import { ActivityIndicator, Colors } from "react-native-paper";

import { SafeArea } from "../../../components/utility/safe_area.component";
import { Spacer } from "../../../components/spacer/spacer.component";
import {FavouritesBar} from "../../../components/favourites/favourites-bar.component";
import { FavouritesContext, FavouritesContextProvider } from "../../../services/favourites/favourites.context";

import { RestaurantsContext } from "../../../services/restaurants/restaurants.context";

import { Search } from "../components/search.component";
import { RestaurantInfoCard } from "../components/restaurant_info_card.component";

const RestaurantList = styled(FlatList).attrs({
  contentContainerStyle: {
    padding: 16,
  },
})``;

const Loading = styled(ActivityIndicator)`
  margin-left: -25px;
`;
const LoadingContainer = styled.View`
  position: absolute;
  top: 50%;
  left: 50%;
`;

export const RestaurantsScreen = ({ navigation }) => {
  const { isLoading, restaurants } = useContext(RestaurantsContext);
  const { favourites } = useContext (FavouritesContext);
  const [isToggled, setIsToggled] = useState(false);
    return (
    <SafeArea>
      {isLoading && (
        <LoadingContainer>
          <Loading size={50} animating={true} color="#2196F3" />
        </LoadingContainer>
      )}
      <Search isFavouritesToggled={isToggled} 
      onFavouritesToggle={() => setIsToggled(!isToggled)}
      />
      {isToggled && <FavouritesBar favourites={favourites} onDetail={navigation.navigate}/>}
      <RestaurantList
        data={restaurants}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity 
            onPress={() => navigation.navigate("RestaurantDetail", {
              restaurant: item,
            })
            }
            >
            <Spacer position="bottom" size="large">
              <RestaurantInfoCard restaurant={item} />
            </Spacer>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.name}
      />
    </SafeArea>
  );
};
import { MaterialIcons } from '@expo/vector-icons';
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Divider } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";

export default function MenuItems({ restaurantName, foods, marginLeft }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartReducer.selectedItems.items);
  const favouriteItems = useSelector((state) => state.favouriteReducer.favouriteItems);

  const selectItem = (item, checkboxValue) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...item,
        restaurantName: restaurantName,
        checkboxValue: checkboxValue,
      },
    });
  };

  const toggleFavourite = (food) => {
    const isFavourite = favouriteItems.find((item) => item.id === food.id);
    dispatch({
      type: isFavourite ? "REMOVE_FROM_FAVOURITES" : "ADD_TO_FAVOURITES",
      payload: {
        ...food,
        restaurantName: restaurantName,
        id: food.id || Math.random().toString(),
      },
    });
  };

  const isFoodInCart = (food) => 
    cartItems.find((item) => item.title === food.title);

  const FoodInfo = (props) => (
    <View style={{ width: 240, justifyContent: "space-evenly" }}>
      <Text style={styles.titleStyle}>{props.food.title}</Text>
      <Text>{props.food.description}</Text>
      <Text>{props.food.price}</Text>
    </View>
  );

  const FoodImage = ({ marginLeft, ...props }) => (
    <View>
      <Image
        source={{ uri: props.food.image }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 8,
          marginLeft: marginLeft,
        }}
      />
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {foods.map((food, index) => (
        <View key={index}>
          <View style={styles.menuItemStyle}>
            <BouncyCheckbox
              iconStyle={{ borderColor: "lightgray", borderRadius: 0 }}
              fillColor="green"
              isChecked={isFoodInCart(food)}
              onPress={(checkboxValue) => selectItem(food, checkboxValue)}
            />
            <FoodInfo food={food} />
            <View style={styles.rightContainer}>
              <TouchableOpacity onPress={() => toggleFavourite(food)}>
                <MaterialIcons 
                  name={favouriteItems.find(item => item.id === food.id) ? "favorite" : "favorite-border"}
                  size={24}
                  color="red"
                />
              </TouchableOpacity>
              <FoodImage food={food} marginLeft={marginLeft ? marginLeft : 0} />
            </View>
          </View>
          <Divider width={0.5} orientation="vertical" />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menuItemStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  titleStyle: {
    fontSize: 19,
    fontWeight: "600",
  },
  rightContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10
  }
});
import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Divider } from "react-native-elements";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { useDispatch, useSelector } from "react-redux";

export default function MenuItems({ restaurantName, foods }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(
    (state) => state.cartReducer.selectedItems.items
  );

  const selectItem = (item, checkboxValue) => 
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        ...item,
        restaurantName: restaurantName,
        checkboxValue: checkboxValue,
      },
    });

  const isFoodInCart = (food) => 
    cartItems.find((item) => item.name === food.name);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
      >
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
              <FoodImage food={food} />
            </View>
            <Divider width={0.5} orientation="vertical" />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const FoodInfo = ({ food }) => (
  <View style={styles.foodInfo}>
    <Text style={styles.titleStyle}>{food.name}</Text>
    <Text>{food.description}</Text>
    <Text>{food.price} Tk</Text>
  </View>
);

const FoodImage = ({ food }) => (
  <View>
    <Image source={{ uri: food.image_url }} style={styles.foodImage} />
  </View>
);

const styles = StyleSheet.create({
  menuItemStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 20,
  },
  foodInfo: {
    width: 240,
    justifyContent: "space-evenly",
  },
  titleStyle: {
    fontSize: 19,
    fontWeight: "600",
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
});
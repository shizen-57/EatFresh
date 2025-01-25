import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Divider } from "react-native-elements";
import { useCart } from "../../context/CartContext";

export default function MenuItems({ restaurantName, restaurantId, foods }) {
  const { selectedItems, addToCart } = useCart();

  const selectItem = (item, checkboxValue) => {
    addToCart(item, restaurantName, restaurantId, checkboxValue);
  };

  const isFoodInCart = (food) => 
    selectedItems.items.find(
      (item) => 
        item.name === food.name && 
        item.restaurantId === restaurantId
    );

  const FoodInfo = (props) => (
    <View style={styles.foodInfo}>
      <Text style={styles.titleStyle}>{props.food.name}</Text>
      <Text style={styles.description}>{props.food.description}</Text>
      <Text style={styles.price}>৳{props.food.price}</Text>
      <View style={styles.dishTypes}>
        {props.food.dish_type && props.food.dish_type.map((type, index) => (
          <Text key={index} style={styles.dishType}>
            {type}
          </Text>
        ))}
      </View>
    </View>
  );

  const FoodImage = (props) => (
    <View>
      <Image 
        source={{ uri: props.food.image_url }} 
        style={styles.foodImage} 
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
            <FoodImage food={food} />
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
  foodInfo: {
    width: 240,
    justifyContent: "space-evenly",
  },
  titleStyle: {
    fontSize: 19,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "gray",
    marginTop: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 5,
  },
  foodImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  dishTypes: {
    flexDirection: "row",
    marginTop: 5,
    flexWrap: "wrap",
  },
  dishType: {
    fontSize: 12,
    color: "gray",
    marginRight: 8,
    backgroundColor: "#f5f5f5",
    padding: 4,
    borderRadius: 4,
  }
});
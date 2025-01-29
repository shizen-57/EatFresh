import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";

const About = ({ restaurant, navigation, menuItems }) => {
  if (!restaurant) return null;

  const handleCateringPress = () => {
    if (navigation) {
      // Filter menu items that are available for catering
      const cateringItems = menuItems.map(item => ({
        ...item,
        image: item.image_url || item.image,
        basePrice: item.price,
        minGuests: 10,
        // Ensure options are properly structured
        options: item.options || {}
      }));

      navigation.navigate('CateringMenuScreen', {
        menuItems: cateringItems,
        restaurantName: restaurant.name
      });
    } else {
      Alert.alert('Navigation Error', 'Unable to navigate to catering menu');
    }
  };

  const { 
    name, 
    image_url, 
    price, 
    review_count, 
    rating, 
    categories,
    transactions
  } = restaurant;

  const formattedCategories = Array.isArray(categories) 
    ? categories.join(" • ") 
    : "";

  return (
    <View>
      <RestaurantImage image={image_url} />
      <RestaurantTitle title={name} />
      <RestaurantDescription
        description={`${formattedCategories} ${
          price ? " • " + price : ""
        } • 🎫 • ${rating} ⭐ (${review_count}+)`}
      />
      {transactions.includes("catering") && (
        <TouchableOpacity 
          style={styles.cateringButton}
          onPress={handleCateringPress}
        >
          <Text style={styles.cateringButtonText}>Catering Service Available</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const RestaurantImage = ({ image }) => (
  <Image source={{ uri: image }} style={styles.image} />
);

const RestaurantTitle = ({ title }) => (
  <Text style={styles.title}>{title}</Text>
);

const RestaurantDescription = ({ description }) => (
  <Text style={styles.description}>{description}</Text>
);

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 180,
  },
  title: {
    fontSize: 29,
    fontWeight: "600",
    marginTop: 10,
    marginHorizontal: 15,
  },
  description: {
    fontSize: 15.5,
    fontWeight: "400",
    marginTop: 10,
    marginHorizontal: 15,
  },
  cateringButton: {
    borderColor: '#32CD32',
    borderWidth: 2,
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    margin: 20,
    backgroundColor: '#fff',
  },
  cateringButtonText: {
    color: '#32CD32',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default About;
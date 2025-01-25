import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const About = ({ restaurant }) => {
  if (!restaurant) return null;

  const { 
    name, 
    image_url, 
    price, 
    review_count, 
    rating, 
    categories 
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
});

export default About;
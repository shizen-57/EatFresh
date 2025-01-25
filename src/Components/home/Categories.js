import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const categories = [
  "Bengali",
  "Seafood",
  "Biryani",
  "Curry",
  "Vegetarian",
  "Indian",
  "Bread",
  "Rice",
  "Tandoori",
  "Street Food",
  "Grill",
  "International",
  "Kebab"
];

export default function Categories() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={styles.categoryButton}
            onPress={() => navigation.navigate("CategoryScreen", { category })}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    backgroundColor: "#fff",
    paddingVertical: 10,
  },
  categoryButton: {
    backgroundColor: "#eee",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
  },
  categoryText: {
    fontWeight: "600",
    fontSize: 13,
  }
});
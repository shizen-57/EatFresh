import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function RestaurantPreview({ restaurant, route }) {
  return (
    <View style={styles.container}>
      <ScrollView style = {styles.scrollView}>
        <Image source={{ uri: restaurant.image_url }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{restaurant.name}</Text>
          <Text style={styles.address}>{restaurant.location.address1}</Text>
          <Text style={styles.categories}>
            {restaurant.categories.map(cat => cat.title).join(' • ')}
          </Text>
          {route && (
            <Text style={styles.route}>
              {route.distance}km • {route.duration} mins
            </Text>
          )}
          <Text style={styles.price}>{restaurant.price}</Text>
          <Text style={styles.menuTitle}>Menu Highlights:</Text>
          {restaurant.menu.slice(0, 3).map(item => (
            <View key={item.id} style={styles.menuItem}>
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>৳{item.price}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '40%',
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  scrollView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  details: {
    padding: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  categories: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  route: {
    fontSize: 14,
    color: '#000',
    marginTop: 5,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#2ecc71',
    marginTop: 5,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  menuName: {
    fontSize: 14,
  },
  menuPrice: {
    fontSize: 14,
    color: '#666',
  },
});
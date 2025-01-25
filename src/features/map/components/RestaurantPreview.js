import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function RestaurantPreview({ restaurant, route }) {
  if (!restaurant) {
    return null;
  }

  const renderMenuItems = () => {
    if (!restaurant.menu || !global.menuItems) {
      return null;
    }

    return restaurant.menu.slice(0, 3).map((itemId) => {
      const menuItem = global.menuItems[itemId];
      if (!menuItem) return null;

      return (
        <View key={itemId} style={styles.menuItem}>
          <View style={styles.menuItemDetails}>
            <Text style={styles.menuItemName}>{menuItem.name}</Text>
            <Text style={styles.menuItemDescription} numberOfLines={2}>
              {menuItem.description}
            </Text>
          </View>
          <Text style={styles.menuItemPrice}>৳{menuItem.price}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image 
          source={{ uri: restaurant.image_url }} 
          style={styles.image}
        />
        <View style={styles.details}>
          <Text style={styles.name}>{restaurant.name || 'Restaurant Name'}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {restaurant.rating || 'N/A'}</Text>
            <Text style={styles.reviewCount}>
              ({restaurant.review_count || 0} reviews)
            </Text>
            <Text style={styles.price}>{restaurant.price || ''}</Text>
          </View>

          <Text style={styles.categories}>
            {Array.isArray(restaurant.categories) 
              ? restaurant.categories.join(' • ')
              : ''}
          </Text>

          {restaurant.location && (
            <View style={styles.locationContainer}>
              <MaterialIcons name="location-on" size={16} color="#666" />
              <View style={styles.addressContainer}>
                <Text style={styles.address}>
                  {restaurant.location.address1 || ''}
                </Text>
                <Text style={styles.city}>
                  {restaurant.location.city || ''}, {restaurant.location.state || ''} {restaurant.location.zip_code || ''}
                </Text>
              </View>
            </View>
          )}

          {route && (
            <View style={styles.routeContainer}>
              <MaterialIcons name="directions-car" size={16} color="#000" />
              <Text style={styles.route}>
                {route.distance}km • {route.duration} mins
              </Text>
            </View>
          )}

          {Array.isArray(restaurant.transactions) && (
            <View style={styles.transactionsContainer}>
              {restaurant.transactions.map((transaction, index) => (
                <View key={index} style={styles.transactionBadge}>
                  <Text style={styles.transactionText}>
                    {transaction.charAt(0).toUpperCase() + transaction.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <Text style={styles.menuTitle}>Menu Highlights:</Text>
          {renderMenuItems()}
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
    maxHeight: '45%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  details: {
    padding: 15,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  categories: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 12,
    gap: 4,
  },
  addressContainer: {
    flex: 1,
  },
  address: {
    fontSize: 15,
    color: '#1a1a1a',
  },
  city: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 8,
  },
  route: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  transactionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  transactionBadge: {
    backgroundColor: '#FF4B4B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  transactionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1a1a1a',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemDetails: {
    flex: 1,
    marginRight: 12,
  },
  menuItemName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
  menuItemDescription: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
  },
  menuItemPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2ecc71',
  },
});
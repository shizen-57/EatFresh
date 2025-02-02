import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { Image } from 'react-native-elements';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CateringMenuItem = ({ item, onSelect }) => {
  const basePrice = item.price || 0;
  const minGuests = item.minGuests || 10;
  const priceText = `৳${basePrice} base price`;

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={() => onSelect({
        ...item,
        basePrice,
        minGuests
      })}
      activeOpacity={0.7}
    >
      <View style={styles.contentContainer}>
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{priceText}</Text>
            <Text style={styles.minGuests}>Min. {minGuests} guests</Text>
          </View>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.image}
            PlaceholderContent={<ActivityIndicator />}
          />
        </View>
      </View>
      {item.popularItem && (
        <View style={styles.popularBadge}>
          <MaterialIcons name="star" size={16} color="#fff" />
          <Text style={styles.popularText}>Popular</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginRight: 8,
  },
  minGuests: {
    fontSize: 13,
    color: '#000',
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    left: 16,
    backgroundColor: '#ff3008',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
});

export default React.memo(CateringMenuItem);

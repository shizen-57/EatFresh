import React from 'react';
import { ScrollView, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

const categories = [
  {
    id: '1',
    name: 'Bengali',
    icon: require('../../../assets/categories/bangali_foods.jpg'),
  },
  {
    id: '2',
    name: 'Biryani',
    icon: require('../../../assets/categories/biriyani.jpg'),
    backgroundColor: '#F5EBFF'
  },
  {
    id: '3',
    name: 'Seafood',
    icon: require('../../../assets/categories/seafood.jpg'),
    backgroundColor: '#E5F7FF'
  },
  {
    id: '4',
    name: 'Curry',
    icon: require('../../../assets/categories/curry.jpg'),
    backgroundColor: '#FFF5E5'
  },
  {
    id: '5',
    name: 'Chocolate',
    icon: require('../../../assets/categories/chocolate.jpg'),
    backgroundColor: '#FFF5E5'
  },
  {
    id: '6',
    name: 'Burger',
    icon: require('../../../assets/categories/burger.jpg'),
    backgroundColor: '#FFF5E5'
  },
  {
    id: '7',
    name: 'Pizza',
    icon: require('../../../assets/categories/pizza.jpg'),
    backgroundColor: '#FFF5E5'
  },
  {
    id: '8',
    name: 'Teheri',
    icon: require('../../../assets/categories/teheri.jpg'),
    backgroundColor: '#FFF5E5'
  },
  {
    id: '9',
    name: 'Vegetarian',
    icon: require('../../../assets/categories/Vegetarian.jpg'),
    backgroundColor: '#FFF5E5'
  },
];

const CategoryCard = React.memo(({ item, onPress }) => (
  <TouchableOpacity 
    style={styles.categoryCard}
    onPress={onPress}
  >
    <View style={styles.imageContainer}>
      <Image 
        source={item.icon} 
        style={styles.categoryIcon}
        resizeMode="cover"
      />
    </View>
    <Text style={styles.categoryName}>{item.name}</Text>
  </TouchableOpacity>
));

export default function Categories() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Popular Categories</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((item) => (
          <CategoryCard
            key={item.id}
            item={item}
            onPress={() => navigation.navigate("CategoryScreen", { category: item.name })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingVertical: SPACING.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.md,
    color: COLORS.text.primary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 80,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: COLORS.card.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  categoryIcon: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    marginTop: SPACING.xs,
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.text.primary,
    textAlign: 'center',
  }
});
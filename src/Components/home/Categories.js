import React from 'react';
import { ScrollView, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY } from '../../theme';

const categories = [
  {
    id: '1',
    name: 'Bengali',
    icon: require('../../../assets/categories/bangali_foods.jpg'),
    alias: 'bangladeshi'  // Match with JSON categories
  },
  {
    id: '2',
    name: 'Biryani',
    icon: require('../../../assets/categories/biriyani.jpg'),
    alias: 'biryani'
  },
  {
    id: '3',
    name: 'Seafood',
    icon: require('../../../assets/categories/seafood.jpg'),
    alias: 'seafood'
  },
  {
    id: '4',
    name: 'Curry',
    icon: require('../../../assets/categories/curry.jpg'),
    backgroundColor: '#FFF5E5',
    alias: 'curry'
  },
  {
    id: '5',
    name: 'Chocolate',
    icon: require('../../../assets/categories/chocolate.jpg'),
    backgroundColor: '#FFF5E5',
    alias: 'chocolate'
  },
  {
    id: '6',
    name: 'Burger',
    icon: require('../../../assets/categories/burger.jpg'),
    backgroundColor: '#FFF5E5',
    alias: 'burger'
  },
  {
    id: '7',
    name: 'Pizza',
    icon: require('../../../assets/categories/pizza.jpg'),
    backgroundColor: '#FFF5E5',
    alias: 'pizza'
  },
  {
    id: '8',
    name: 'Teheri',
    icon: require('../../../assets/categories/teheri.jpg'),
    backgroundColor: '#FFF5E5',
    alias: 'teheri'
  },
  {
    id: '9',
    name: 'Vegetarian',
    icon: require('../../../assets/categories/Vegetarian.jpg'),
    backgroundColor: '#FFF5E5',
    alias: 'vegetarian'
  },
];

const CategoryCard = React.memo(({ item, onPress }) => (
  <TouchableOpacity 
    style={[styles.categoryCard, { backgroundColor: COLORS.surface }]}
    onPress={onPress}
    activeOpacity={0.7}
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

  const handleCategoryPress = (category) => {
    navigation.navigate("CategoryScreen", {
      categoryName: category.name,
      categoryAlias: category.alias
    });
  };

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
            onPress={() => handleCategoryPress(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    marginLeft: SPACING.md,
    color: '#282c3f',
  },
  scrollContent: {
    paddingHorizontal: SPACING.md,
  },
  categoryCard: {
    alignItems: 'center',
    marginRight: SPACING.md,
    width: 72,
  },
  imageContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
    elevation: 2,
    shadowColor: 'rgba(0,0,0,0.1)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  categoryIcon: {
    width: '100%',
    height: '100%',
  },
  categoryName: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
    color: '#686b78',
    textAlign: 'center',
  }
});
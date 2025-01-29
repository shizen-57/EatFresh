import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Animated, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import { Header, Divider } from 'react-native-elements';
import PropTypes from 'prop-types';
import CateringMenuItem from '../components/CateringMenuItem';
import LottieView from 'lottie-react-native';
import { useCatering } from '../context/CateringContext';
import ViewCartButton from '../components/ViewCartButton';

/**
 * CateringMenuScreen component displays the catering menu items
 * @param {Object} props - Component props
 * @param {Object} props.navigation - Navigation object
 * @param {Object} props.route - Route object containing params
 */
const CateringMenuScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollY = new Animated.Value(0);

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [200, 60],
    extrapolate: 'clamp'
  });

  const { menuItems, restaurantName } = route.params || {};
  const { addToCateringCart, cateringCart } = useCatering();

  if (!menuItems || !restaurantName) {
    return (
      <View style={styles.errorContainer}>
        <Text>Invalid menu data</Text>
      </View>
    );
  }

  const handleItemSelect = (item) => {
    try {
      // Ensure all required data is present
      const itemForDetail = {
        ...item,
        basePrice: item.basePrice || item.price,
        minGuests: item.minGuests || 10,
        image: item.image_url || item.image,
        options: item.options || {},
        customizable: true
      };

      console.log('Sending item to detail:', itemForDetail); // Debug log

      navigation.navigate('CateringDetail', { 
        item: itemForDetail,
        restaurantName
      });
    } catch (err) {
      console.error('Navigation error:', err);
      setError('Failed to navigate to details');
    }
  };

  const renderItem = ({ item, index }) => (
    <Animated.View
      style={{
        transform: [{
          scale: scrollY.interpolate({
            inputRange: [-100, 0, 100 * index, 100 * (index + 2)],
            outputRange: [1, 1, 1, 0.8]
          })
        }]
      }}
    >
      <CateringMenuItem 
        item={item} 
        onSelect={handleItemSelect}
        testID={`catering-menu-item-${index}`}
      />
    </Animated.View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <Text style={styles.restaurantName}>{restaurantName}</Text>
      <Text style={styles.subtitle}>Catering Menu</Text>
      <Text style={styles.description}>
        Perfect for events and large gatherings. Order must be placed 24 hours in advance.
      </Text>
      <Divider style={styles.divider} />
    </View>
  );

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const calculateCartTotals = () => {
    return {
      itemCount: cateringCart.length,
      total: cateringCart.reduce((sum, item) => sum + item.totalPrice, 0)
    };
  };

  const handleViewCart = () => {
    navigation.navigate('CateringCart');
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={menuItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: cateringCart.length > 0 ? 100 : 20 }
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <Divider style={styles.itemDivider} />}
      />
      <ViewCartButton 
        itemCount={calculateCartTotals().itemCount}
        total={calculateCartTotals().total}
        onPress={handleViewCart}
      />
    </SafeAreaView>
  );
};

CateringMenuScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      menuItems: PropTypes.array.isRequired,
      restaurantName: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  sectionHeader: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: 20,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#eee',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default React.memo(CateringMenuScreen);

import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View, StyleSheet, Button } from "react-native";
import { Divider } from "react-native-elements";
import { onValue, realtimeDb, ref } from "../../firebase";
import About from "../Components/RestaurantDetail/About";
import CartIconManager from '../Components/RestaurantDetail/CartIconManager';
import MenuItems from "../Components/RestaurantDetail/MenuItems";
import { useGroupOrder } from "../features/group_ordering/context/GroupOrderContext";
import GroupCartIcon from "../features/group_ordering/group_cart/GroupCartIcon";
import { useCatering } from "../features/catering/context/CateringContext";

const RestaurantDetail = ({ route, navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurant: initialRestaurant } = route.params;
  const { groupOrder, currentMember, addItemToGroupCart } = useGroupOrder();
  const cateringContext = useCatering();
 
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        if (!initialRestaurant?.menu || !Array.isArray(initialRestaurant.menu)) {
          console.log("No valid menu array found");
          setLoading(false);
          return;
        }

        // Filter out any empty or invalid menu IDs
        const validMenuIds = initialRestaurant.menu.filter(id => id && typeof id === 'string');
        console.log("Valid menu IDs:", validMenuIds); // Debug log

        if (validMenuIds.length === 0) {
          console.log("No valid menu IDs found");
          setLoading(false);
          return;
        }

        const menuItemsRef = ref(realtimeDb, 'menuItems');
        onValue(menuItemsRef, (snapshot) => {
          if (snapshot.exists()) {
            const allMenuItems = snapshot.val();
            const restaurantMenuItems = validMenuIds
              .map(menuId => {
                const item = allMenuItems[menuId];
                return item ? {
                  ...item,
                  id: menuId,
                  restaurantId: initialRestaurant.id
                } : null;
              })
              .filter(Boolean);

            console.log("Fetched menu items:", restaurantMenuItems); // Debug log
            setMenuItems(restaurantMenuItems);
          }
          setLoading(false);
        });
      } catch (err) {
        console.error("Error fetching menu items:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [initialRestaurant]);

  const handleAddToCart = async (item) => {
    if (groupOrder) {
      try {
        await addItemToGroupCart({
          ...item,
          restaurantName: initialRestaurant.name,
          restaurantId: initialRestaurant.id
        }, currentMember);
        Alert.alert('Success', 'Item added to group cart');
      } catch (error) {
        Alert.alert('Error', 'Failed to add item to group cart');
      }
    } else if (cateringContext && item.cateringAvailable) {
      try {
        cateringContext.addToCateringCart({
          ...item,
          restaurantName: initialRestaurant.name,
          restaurantId: initialRestaurant.id
        });
        Alert.alert('Success', 'Item added to catering cart');
      } catch (error) {
        Alert.alert('Error', 'Failed to add item to catering cart');
      }
    } else {
      // Regular cart logic
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!initialRestaurant) {
    return (
      <View style={styles.errorContainer}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <About 
          restaurant={initialRestaurant} 
          navigation={navigation}
          menuItems={menuItems}
        />
        <Divider width={1.8} style={styles.divider} />
        <MenuItems 
          restaurantName={initialRestaurant.name}
          restaurantId={initialRestaurant.id}
          foods={menuItems}
          onCateringSelect={cateringContext?.addToCateringCart}
        />
      </ScrollView>
      <CartIconManager navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    marginVertical: 20,
  },
});

export default RestaurantDetail;
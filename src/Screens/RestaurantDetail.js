import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, View } from "react-native";
import { Divider } from "react-native-elements";
import { onValue, realtimeDb, ref } from "../../firebase";
import About from "../Components/RestaurantDetail/About";
import CartIconManager from '../Components/RestaurantDetail/CartIconManager';
import MenuItems from "../Components/RestaurantDetail/MenuItems";
import { useGroupOrder } from "../features/group_ordering/context/GroupOrderContext";
import GroupCartIcon from "../features/group_ordering/group_cart/GroupCartIcon";

const RestaurantDetail = ({ route, navigation }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurant: initialRestaurant } = route.params;
  const { groupOrder, currentMember, addItemToGroupCart } = useGroupOrder();

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
    } else {
      // Regular cart logic
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!initialRestaurant) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Restaurant not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <About restaurant={initialRestaurant} />
        <Divider width={1.8} style={{ marginVertical: 20 }} />
        <MenuItems 
          restaurantName={initialRestaurant.name}
          restaurantId={initialRestaurant.id}
          foods={menuItems}
        />
      </ScrollView>
      <CartIconManager navigation={navigation} />
    </View>
  );
};

export default RestaurantDetail;
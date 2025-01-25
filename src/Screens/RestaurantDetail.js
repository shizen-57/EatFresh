import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import { Divider } from "react-native-elements";
import { realtimeDb, ref, onValue } from "../../firebase";
import About from "../Components/RestaurantDetail/About";
import MenuItems from "../Components/RestaurantDetail/MenuItems";
import ViewCart from "../Components/RestaurantDetail/ViewCart";

export default function RestaurantDetail({ route, navigation }) {
  const [menuItems, setMenuItems] = useState([]);
  const { id, name } = route.params;

  useEffect(() => {
    const menuRef = ref(realtimeDb, `restaurants/${id}/menu`);
    onValue(menuRef, (snapshot) => {
      if (snapshot.exists()) {
        const menuIds = snapshot.val();
        const menuItemsRef = ref(realtimeDb, 'menuItems');
        onValue(menuItemsRef, (menuSnapshot) => {
          if (menuSnapshot.exists()) {
            const allMenuItems = menuSnapshot.val();
            const restaurantMenuItems = menuIds
              .map(id => allMenuItems[id])
              .filter(item => item.restaurantId === id);
            setMenuItems(restaurantMenuItems);
          }
        });
      }
    });
  }, [id]);

  return (
    <View style={{ flex: 1 }}>
      <About route={route} />
      <Divider width={1.8} style={{ marginVertical: 20 }} />
      <MenuItems 
        restaurantName={name}
        restaurantId={id}
        foods={menuItems}
      />
      <ViewCart navigation={navigation} />
    </View>
  );
}
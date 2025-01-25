import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import { useCart } from "../context/CartContext";
import LottieView from "lottie-react-native";
import { db, collection, getDocs } from "../../firebase";
import MenuItems from "../Components/RestaurantDetail/MenuItems";

export default function OrderCompleted() {
  const [lastOrder, setLastOrder] = useState({
    items: [],
  });

  const { selectedItems } = useCart();
  const { items, restaurantName } = selectedItems;

  useEffect(() => {
    const fetchLastOrder = async () => {
      const ordersRef = collection(db, "orders");
      const querySnapshot = await getDocs(ordersRef);
      const lastOrderData = querySnapshot.docs[0]?.data();
      setLastOrder(lastOrderData);
    };

    fetchLastOrder();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View style={{ margin: 15, alignItems: "center", height: "100%" }}>
        <LottieView
          style={{ height: 100, alignSelf: "center", marginBottom: 30 }}
          source={require("../../assets/animations/check-mark.json")}
          autoPlay
          speed={0.15}
          loop={true}
        />
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Your order at {restaurantName} has been placed for {items.length} items.
        </Text>
        <ScrollView>
          <MenuItems restaurantName={restaurantName} foods={lastOrder.items} />
        </ScrollView>
        <LottieView
          style={{ height: 200, alignSelf: "center" }}
          source={require("../../assets/animations/cooking.json")}
          autoPlay
          speed={0.25}
          loop={true}
        />
      </View>
    </SafeAreaView>
  );
}
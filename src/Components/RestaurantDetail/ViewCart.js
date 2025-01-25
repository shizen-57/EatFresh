import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from "react-native";
import { useCart } from "../../context/CartContext";
import OrderItem from "./OrderItem";
import { db } from "../../../firebase";
import { collection, addDoc } from 'firebase/firestore';


export default function ViewCart({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { selectedItems } = useCart();
  const { items, restaurantName } = selectedItems;

  const total = items
    .map((item) => item.price || 0)
    .reduce((prev, curr) => prev + curr, 0);

  const totalFormatted = total.toLocaleString("en", {
    style: "currency",
    currency: "BDT",
  });

  const addOrderToFirestore = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items,
        restaurantName: restaurantName,
        total: total,
        status: "pending",
        createdAt: new Date().toISOString(),
        orderNumber: Math.floor(Math.random() * 100000).toString(),
        userDetails: {
          name: "Guest User",
          address: "Default Address",
          phone: "Default Phone"
        }
      };

      const ordersRef = collection(db, "orders");
      const docRef = await addDoc(ordersRef, orderData);
      
      setLoading(false);
      setModalVisible(false);
      navigation.navigate("OrderCompleted", { 
        orderId: docRef.id 
      });
    } catch (error) {
      console.error("Error adding order: ", error);
      setLoading(false);
    }
  };

  const checkoutModalContent = () => {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalCheckoutContainer}>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {items.map((item, index) => (
              <OrderItem key={index} item={item} />
            ))}
          </ScrollView>
          <View style={styles.subtotalContainer}>
            <Text style={styles.subtotalText}>Subtotal</Text>
            <Text>{totalFormatted}</Text>
          </View>
          <TouchableOpacity
            style={{
              marginTop: 20,
              backgroundColor: "black",
              alignItems: "center",
              padding: 13,
              borderRadius: 30,
              width: 300,
              position: "relative",
              marginLeft: 26,
            }}
            onPress={() => {
              addOrderToFirestore();
              setModalVisible(false);
            }}
          >
            <Text style={{ color: "white", fontSize: 20 }}>Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        {checkoutModalContent()}
      </Modal>
      {items.length > 0 && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            position: "absolute",
            bottom: 45,
            zIndex: 999,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "center", width: "100%" }}>
            <TouchableOpacity
              style={{
                marginTop: 20,
                backgroundColor: "black",
                alignItems: "center",
                padding: 15,
                borderRadius: 30,
                width: 300,
                position: "relative",
              }}
              onPress={() => setModalVisible(true)}
            >
              <Text style={{ color: "white", fontSize: 20 }}>View Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  modalCheckoutContainer: {
    backgroundColor: "white",
    padding: 15,
    height: 500,
    borderWidth: 1,
  },
  restaurantName: {
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    marginBottom: 10,
  },
  subtotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  subtotalText: {
    textAlign: "left",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 10,
  },
});
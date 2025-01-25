import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, TextInput } from "react-native";
import { useCart } from "../../context/CartContext";
import OrderItem from "./OrderItem";
import { db } from "../../../firebase";
import { collection, addDoc } from 'firebase/firestore';

export default function ViewCart({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({
    name: '',
    phone: '',
    address: '',
    message: ''
  });
  const { selectedItems, clearCart } = useCart();
  const { items, restaurantName } = selectedItems;

  const total = items
    .map((item) => item.finalPrice || item.price || 0)
    .reduce((prev, curr) => prev + curr, 0);

  const totalFormatted = total.toLocaleString("en", {
    style: "currency",
    currency: "BDT",
  });

  const validateForm = () => {
    if (!userDetails.phone || !userDetails.address) {
      alert("Phone number and address are required");
      return false;
    }
    if (userDetails.phone.length < 11) {
      alert("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const addOrderToFirestore = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          ...item,
          price: item.finalPrice || item.price,
          customizations: item.selectedOptions || {}
        })),
        restaurantName,
        total,
        status: "pending",
        createdAt: new Date().toISOString(),
        orderNumber: Math.floor(Math.random() * 100000).toString(),
        userDetails: {
          ...userDetails,
          phone: userDetails.phone.trim()
        }
      };

      const ordersRef = collection(db, "orders");
      const docRef = await addDoc(ordersRef, orderData);
      
      setLoading(false);
      setModalVisible(false);
      clearCart();
      navigation.navigate("OrderCompleted", { 
        orderId: docRef.id,
        orderData 
      });
    } catch (error) {
      console.error("Error adding order: ", error);
      setLoading(false);
      alert("Error placing order. Please try again.");
    }
  };

  const UserDetailsForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={userDetails.name}
        onChangeText={(text) => setUserDetails(prev => ({ ...prev, name: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number *"
        keyboardType="phone-pad"
        value={userDetails.phone}
        onChangeText={(text) => setUserDetails(prev => ({ ...prev, phone: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Delivery Address *"
        multiline
        value={userDetails.address}
        onChangeText={(text) => setUserDetails(prev => ({ ...prev, address: text }))}
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Message for Rider (Optional)"
        multiline
        value={userDetails.message}
        onChangeText={(text) => setUserDetails(prev => ({ ...prev, message: text }))}
      />
    </View>
  );

  const checkoutModalContent = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalCheckoutContainer}>
        <Text style={styles.restaurantName}>{restaurantName}</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {items.map((item, index) => (
            <OrderItem key={index} item={item} />
          ))}
          <UserDetailsForm />
          <View style={styles.subtotalContainer}>
            <Text style={styles.subtotalText}>Total</Text>
            <Text style={styles.totalPrice}>{totalFormatted}</Text>
          </View>
        </ScrollView>
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            loading && styles.disabledButton
          ]}
          onPress={addOrderToFirestore}
          disabled={loading}
        >
          <Text style={styles.checkoutButtonText}>
            {loading ? "Placing Order..." : "Place Order"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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
  formContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  messageInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  checkoutButton: {
    backgroundColor: "black",
    padding: 15,
    borderRadius: 30,
    marginHorizontal: 20,
    marginTop: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  checkoutButtonText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
  }
});
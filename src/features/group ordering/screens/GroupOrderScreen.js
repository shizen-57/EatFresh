import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Icon } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { useGroupOrder } from '../context/GroupOrderContext';
import GroupOrderSummary from '../Components/GroupOrderSummary';
import GroupOrderItem from '../Components/GroupOrderItem';
import QRCodeGenerator from '../Components/QRCodeGenerator';

export default function GroupOrderScreen({ navigation }) {
  const { groupOrder, groupCart, members, currentMember, finalizeOrder, setGroupOrder } = useGroupOrder();
  const [qrModalVisible, setQrModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Logic to maintain state when screen is focused
      return () => {
        // Logic to handle when screen is unfocused, if needed
      };
    }, [])
  );

  const handleFinalize = () => {
    finalizeOrder();
    navigation.navigate('CheckoutScreen'); // Navigate to CheckoutScreen
  };

  const handleOrderNow = () => {
    navigation.navigate('HomeScreen'); // Navigate to RestaurantDetail to order items
  };

  const handleDestroyGroup = () => {
    Alert.alert(
      "Destroy Group",
      "Are you sure you want to destroy the group?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Destroy",
          onPress: () => {
            setGroupOrder(null);
            navigation.navigate('HomeScreen');
          },
          style: "destructive"
        }
      ]
    );
  };

  if (!groupOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading group order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <GroupOrderSummary 
          memberCount={members.length}
          totalItems={groupCart.length}
        />
        
        {/* Always show Order Now button if cart is empty */}
        {groupCart.length === 0 && (
          <View style={styles.orderNowContainer}>
            <Text style={styles.orderPromptText}>
              No items in cart yet. Be the first to add something!
            </Text>
            <Button
              title="Order Now"
              onPress={handleOrderNow}
              buttonStyle={styles.orderNowButton}
              titleStyle={styles.orderNowButtonText}
              icon={{
                name: 'plus',
                type: 'font-awesome',
                size: 15,
                color: '#000',
              }}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>Group Members</Text>
        {members.map((member, index) => (
          <Text key={index} style={styles.memberItem}>
            {member} {groupOrder?.creator === member ? '(Leader)' : ''}
          </Text>
        ))}

        <Text style={styles.sectionTitle}>Order Items</Text>
        {groupCart.length === 0 ? (
          <View style={styles.orderNowContainer}>
            <Button
              title="Order Now"
              onPress={handleOrderNow}
              buttonStyle={styles.orderNowButton}
              titleStyle={styles.orderNowButtonText}
            />
          </View>
        ) : (
          groupCart.map((item, index) => (
            <GroupOrderItem 
              key={index}
              item={item}
            />
          ))
        )}
      </ScrollView>

      {/* Only show these buttons for group creator */}
      {groupOrder?.creator === currentMember && (
        <View style={styles.buttonContainer}>
          <Button
            title="Finalize Order"
            onPress={handleFinalize}
            buttonStyle={styles.finalizeButton}
            containerStyle={styles.buttonWrapper}
          />
          <Button
            title="Destroy Group"
            onPress={handleDestroyGroup}
            buttonStyle={styles.destroyButton}
            containerStyle={styles.buttonWrapper}
          />
        </View>
      )}

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setQrModalVisible(true)}
      >
        <Icon name="qrcode" type="font-awesome" color="#fff" size={30} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={qrModalVisible}
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setQrModalVisible(false)}
            >
              <Icon name="times-circle" type="font-awesome" size={30} color="#000" />
            </TouchableOpacity>
            {groupOrder && (
              <QRCodeGenerator groupData={groupOrder} />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    backgroundColor: '#f5f5f5',
  },
  memberItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  button: {
    margin: 15,
    backgroundColor: '#000',
    paddingVertical: 12,
  },
  destroyButton: {
    backgroundColor: 'red',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    backgroundColor: '#000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -15,
    right: -15,
    zIndex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
  },
  orderNowContainer: {
    padding: 15,
    alignItems: 'center',
  },
  orderNowButton: {
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: 'transparent',
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  orderNowButtonText: {
    color: '#000',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  finalizeButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
  },
  destroyButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 25,
    paddingVertical: 12,
  },
  orderPromptText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
});

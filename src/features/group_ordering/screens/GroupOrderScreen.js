import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Modal, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Icon, Divider } from 'react-native-elements';
import { useFocusEffect } from '@react-navigation/native';
import { useGroupOrder } from '../context/GroupOrderContext';
import GroupOrderSummary from '../Components/GroupOrderSummary';
import GroupOrderItem from '../Components/GroupOrderItem'; // Ensure this import is correct
import QRCodeGenerator from '../Components/QRCodeGenerator';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../../theme/colors';

export default function GroupOrderScreen({ navigation }) {
  const { 
    groupOrder, 
    groupCart, 
    members, 
    currentMember, 
    finalizeOrder,
    setGroupCart // Ensure setGroupCart is imported from context
  } = useGroupOrder();
  const [qrModalVisible, setQrModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      // Logic to maintain state when screen is focused
      return () => {
        // Logic to handle when screen is unfocused, if needed
      };
    }, [])
  );

  const handleFinalize = async () => {
    if (groupCart.length === 0) {
      Alert.alert('Error', 'Cannot finalize empty order');
      return;
    }

    try {
      await finalizeOrder();
      navigation.navigate('GroupCartCheckout', {
        items: groupCart,
        isGroupOrder: true,
        groupOrderId: groupOrder.id
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to finalize order');
    }
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

  const handleAddItem = () => {
    navigation.navigate('AddItem');
  };

  const handleRemoveItem = (itemId) => {
    const updatedGroupCart = groupCart.filter(item => item.id !== itemId);
    setGroupCart(updatedGroupCart);
    // Update the group order in the context or backend
  };

  const groupedItems = React.useMemo(() => {
    return groupCart.reduce((acc, item) => {
      const memberItems = acc[item.addedBy] || [];
      return {
        ...acc,
        [item.addedBy]: [...memberItems, item]
      };
    }, {});
  }, [groupCart]);

  const calculateItemTotal = (item) => {
    const basePrice = item.price || 0;
    const quantity = item.quantity || 1;
    let optionsTotal = 0;

    if (item.selectedOptions) {
      optionsTotal = Object.entries(item.selectedOptions)
        .reduce((sum, [_, option]) => sum + (option.price || 0), 0);
    }

    return (basePrice + optionsTotal) * quantity;
  };

  const calculateMemberTotal = (items) => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0);
  };

  const getTotalAmount = () => {
    return groupCart.reduce((total, item) => total + (item.finalPrice || item.price), 0);
  };

  const getCreatorName = () => {
    if (!groupOrder) return 'Unknown';
    return groupOrder.creatorName || groupOrder.creator || 'Unknown';
  };

  const renderMemberSection = (member, items) => (
    <View key={member} style={styles.memberSection}>
      <View style={styles.memberHeader}>
        <Text style={styles.memberOrderTitle}>{member}'s Order</Text>
        <Text style={styles.memberTotal}>৳{calculateMemberTotal(items)}</Text>
      </View>
      {items.map((item, index) => (
        <View key={`${item.id}-${index}`} style={styles.itemContainer}>
          <GroupOrderItem item={item} handleRemoveItem={handleRemoveItem} />
        </View>
      ))}
    </View>
  );

  if (!groupOrder) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading group order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#171a29', '#2c3a61']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Group Order</Text>
        <Text style={styles.groupInfo}>
          Led by {getCreatorName()}
        </Text>
      </LinearGradient>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Icon name="users" type="font-awesome-5" color="#4CAF50" size={24} />
          <Text style={styles.summaryNumber}>{members.length}</Text>
          <Text style={styles.summaryLabel}>Members</Text>
        </View>

        <View style={styles.summaryCard}>
          <Icon name="shopping-cart" type="font-awesome-5" color="#4CAF50" size={24} />
          <Text style={styles.summaryNumber}>{groupCart.length}</Text>
          <Text style={styles.summaryLabel}>Items</Text>
        </View>

        <View style={styles.summaryCard}>
          <Icon name="money-bill-wave" type="font-awesome-5" color="#4CAF50" size={24} />
          <Text style={styles.summaryNumber}>৳{getTotalAmount()}</Text>
          <Text style={styles.summaryLabel}>Total</Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* Members List */}
      <View style={styles.membersSection}>
        <Text style={styles.sectionTitle}>Group Members</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.membersList}
          contentContainerStyle={styles.membersListContent}
        >
          {members.map((member, index) => (
            <View key={index} style={styles.memberChip}>
              <Icon 
                name={member === groupOrder?.creator ? "crown" : "user"}
                type="font-awesome-5"
                size={14}
                color={member === groupOrder?.creator ? "#ffd700" : "#666"}
                style={styles.memberIcon}
              />
              <Text style={styles.memberName}>{member}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <Divider style={styles.divider} />

      {/* Order Items Section */}
      <Text style={styles.sectionTitle}>Order Items</Text>
      <ScrollView style={styles.itemsContainer}>
        {Object.entries(groupedItems).map(([member, items]) => 
          renderMemberSection(member, items)
        )}
        {Object.keys(groupedItems).length === 0 && (
          <Text style={styles.emptyText}>No items in the group order yet</Text>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <Button
          icon={<Icon name="plus" type="font-awesome-5" color="white" size={15} style={{marginRight: 10}} />}
          title="Add More Items"
          onPress={() => navigation.navigate('HomeScreen')}
          buttonStyle={styles.addMoreButton}
        />
        {groupOrder?.creator === currentMember && groupCart.length > 0 && (
          <Button
            icon={<Icon name="check" type="font-awesome-5" color="white" size={15} style={{marginRight: 10}} />}
            title="Finalize Order"
            onPress={handleFinalize}
            buttonStyle={styles.finalizeButton}
          />
        )}
      </View>

      {/* Share QR Code Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setQrModalVisible(true)}
      >
        <Icon name="qrcode" type="font-awesome-5" color="#fff" size={30} />
      </TouchableOpacity>

      {/* QR Code Modal */}
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
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 24,
    paddingTop: 48,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  groupInfo: {
    color: '#ffffff',
    opacity: 0.9,
    fontSize: 14,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    marginTop: -20,
    marginHorizontal: 16,
    borderRadius: 8,
    padding: 16,
    elevation: 4,
  },
  summaryCard: {
    alignItems: 'center',
    padding: 10,
  },
  summaryNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 12,
  },
  divider: {
    marginVertical: 15,
    backgroundColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    paddingLeft: 16,
    color: '#333',
  },
  membersSection: {
    backgroundColor: '#ffffff',
    marginTop: 16,
    paddingVertical: 16,
  },
  membersList: {
    paddingHorizontal: 15,
  },
  membersListContent: {
    paddingHorizontal: 16,
  },
  memberChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  memberIcon: {
    marginRight: 5,
  },
  memberName: {
    color: '#333',
  },
  itemsContainer: {
    flex: 1,
  },
  memberSection: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 15,
  },
  memberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  memberOrderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  memberTotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  bottomActions: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f2f2f2',
  },
  addMoreButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    marginBottom: 10,
    paddingVertical: 12,
  },
  finalizeButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    paddingVertical: 12,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    backgroundColor: '#4CAF50',
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
  addButton: {
    backgroundColor: '#34c759',
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  memberSection: {
    padding: 15,
    backgroundColor: '#f8f8f8',
    marginBottom: 10,
  },
  memberName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#4CAF50',
  },
  bottomActions: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  addMoreButton: {
    backgroundColor: '#4CAF50',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
    fontSize: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  removeButton: {
    padding: 10,
  },
});

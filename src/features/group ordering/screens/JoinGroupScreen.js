import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { useGroupOrder } from '../context/GroupOrderContext';

export default function JoinGroupScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const { joinGroup } = useGroupOrder();
  const { groupData, fromQRCode } = route.params;

  const handleJoin = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      joinGroup(groupData.groupId, name); // Correct usage of user-provided name
      navigation.replace('GroupOrder', {
        groupId: groupData.groupId,
        memberName: name,
        restaurantId: groupData.restaurantId
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to join group');
    }
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>Join Group Order</Text>
      {fromQRCode && (
        <View style={styles.groupInfo}>
          <Text style={styles.restaurantName}>
            Restaurant: {groupData.restaurantName}
          </Text>
          <Text style={styles.creatorInfo}>
            Created by: {groupData.creatorName}
          </Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
      />
      <Button
        title="Join Group"
        onPress={handleJoin}
        buttonStyle={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  groupInfo: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  creatorInfo: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
  },
});

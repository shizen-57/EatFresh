import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { GroupOrderContext } from '../context/GroupOrderContext';

export default function CreateGroupScreen({ navigation }) {
  const [name, setName] = useState('');
  const { createGroup, groupOrder, setGroupOrder } = useContext(GroupOrderContext);

  useEffect(() => {
    if (groupOrder && groupOrder.status === 'active') {
      setName(groupOrder.creator);
    }
  }, [groupOrder]);

  const handleCreateGroup = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (!createGroup) {
      console.error('createGroup function is not defined');
      return;
    }
    const newGroup = await createGroup(name);
    setGroupOrder(newGroup); // Save the group order state in the context
    navigation.navigate('GroupOrder', {
      groupId: newGroup.id,
      memberName: name,
      restaurantId: newGroup.restaurantId,
    });
  };

  const handleViewGroup = () => {
    navigation.navigate('GroupOrder', {
      groupId: groupOrder.id,
      memberName: groupOrder.creator,
      restaurantId: groupOrder.restaurantId,
    });
  };

  const handleJoinGroup = () => {
    navigation.navigate('ScanQRCode');
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>Group Order</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        editable={!groupOrder || groupOrder.status !== 'active'}
      />
      <Button
        title={groupOrder && groupOrder.status === 'active' ? "View Group" : "Create Group"}
        onPress={groupOrder && groupOrder.status === 'active' ? handleViewGroup : handleCreateGroup}
        buttonStyle={styles.button}
      />
      <Button
        title="Join Group"
        onPress={handleJoinGroup}
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
    marginBottom: 20,
  },
});

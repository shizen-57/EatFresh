import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { GroupOrderContext } from '../context/GroupOrderContext';

export default function CreateGroupScreen({ navigation }) {
  const { 
    groupOrder, 
    currentMember, 
    createGroup, 
    leaveGroup, 
    setGroupOrder,
    members // Add members from context
  } = useContext(GroupOrderContext);
  const [name, setName] = useState('');

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

  const handleLeaveGroup = () => {
    Alert.alert(
      "Leave Group",
      "Are you sure you want to leave this group?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          onPress: async () => {
            await leaveGroup();
            setName('');
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text h4 style={styles.title}>Group Order</Text>
      
      {groupOrder ? (
        // Show group status for joined members
        <>
          <View style={styles.groupStatus}>
            <Text style={styles.statusText}>
              You're in a group with {members?.length || 0} members
            </Text>
            <Text style={styles.memberName}>
              Your name: {currentMember}
            </Text>
          </View>
          <Button
            title="View Group"
            onPress={handleViewGroup}
            buttonStyle={styles.button}
          />
          <Button
            title="Leave Group"
            onPress={handleLeaveGroup}
            buttonStyle={[styles.button, styles.leaveButton]}
          />
        </>
      ) : (
        // Show create/join options
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            value={name}
            onChangeText={setName}
          />
          <Button
            title="Create Group"
            onPress={handleCreateGroup}
            buttonStyle={styles.button}
          />
          <Button
            title="Join Group"
            onPress={handleJoinGroup}
            buttonStyle={[styles.button, styles.joinButton]}
          />
        </>
      )}
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
  groupStatus: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  statusText: {
    fontSize: 16,
    marginBottom: 5,
  },
  memberName: {
    fontSize: 14,
    color: '#666',
  },
  leaveButton: {
    backgroundColor: '#ff3b30',
  },
  joinButton: {
    backgroundColor: '#34c759',
  },
});

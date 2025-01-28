import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, collection, addDoc, updateDoc, doc, getDoc, onSnapshot } from '../../../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GroupOrderContext = createContext();

export const GroupOrderProvider = ({ children }) => {
  const [groupOrder, setGroupOrder] = useState(null);
  const [members, setMembers] = useState([]);
  const [groupCart, setGroupCart] = useState([]);
  const [currentMember, setCurrentMember] = useState(null);

  useEffect(() => {
    let unsubscribe;

    if (groupOrder?.id) {
      // Set up real-time listener for the group order
      unsubscribe = onSnapshot(doc(db, 'groupOrders', groupOrder.id), 
        (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            setGroupOrder(prev => ({ ...data, id: snapshot.id }));
            setMembers(data.members || []);
            setGroupCart(data.items || []);
          }
        },
        (error) => {
          console.error('Firestore listener error:', error);
        }
      );
    }

    // Cleanup listener on unmount or when groupOrder changes
    return () => unsubscribe && unsubscribe();
  }, [groupOrder?.id]);

  useEffect(() => {
    // Load saved group membership
    const loadMembership = async () => {
      try {
        const savedMembership = await AsyncStorage.getItem('groupMembership');
        if (savedMembership) {
          const { groupId, memberName } = JSON.parse(savedMembership);
          // Fetch and set group data
          const groupDoc = await getDoc(doc(db, 'groupOrders', groupId));
          if (groupDoc.exists()) {
            const groupData = groupDoc.data();
            setGroupOrder({ ...groupData, id: groupId });
            setCurrentMember(memberName);
          }
        }
      } catch (error) {
        console.error('Error loading membership:', error);
      }
    };
    loadMembership();
  }, []);

  const createGroup = async (creatorName) => {
    const newGroup = {
      creator: creatorName,
      members: [creatorName],
      items: [],
      status: 'active',
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'groupOrders'), newGroup);
      const newGroupWithId = { ...newGroup, id: docRef.id };
      setGroupOrder(newGroupWithId);
      return newGroupWithId;
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    }
  };

  const joinGroup = async (groupId, memberName) => {
    try {
      const groupRef = doc(db, 'groupOrders', groupId);
      const groupDoc = await getDoc(groupRef);

      if (!groupDoc.exists()) {
        throw new Error('Group not found');
      }

      const groupData = groupDoc.data();
      if (groupData.members.includes(memberName)) {
        throw new Error('Member already exists in group');
      }

      const updatedMembers = [...groupData.members, memberName];
      await updateDoc(groupRef, { members: updatedMembers });
      
      // Save membership
      await AsyncStorage.setItem('groupMembership', JSON.stringify({
        groupId,
        memberName
      }));
      setCurrentMember(memberName);
      return true;
    } catch (error) {
      console.error('Join group error:', error);
      throw error;
    }
  };

  const leaveGroup = async () => {
    await AsyncStorage.removeItem('groupMembership');
    setGroupOrder(null);
    setCurrentMember(null);
  };

  const addItemToGroupCart = async (item, memberName) => {
    if (!groupOrder?.id) return;

    const updatedItem = { ...item, addedBy: memberName, addedAt: new Date().toISOString() };
    const updatedGroupCart = [...groupCart, updatedItem];

    try {
      await updateDoc(doc(db, 'groupOrders', groupOrder.id), { 
        items: updatedGroupCart 
      });
    } catch (error) {
      console.error('Failed to add item to group cart:', error);
      throw error;
    }
  };

  const finalizeOrder = async () => {
    if (!groupOrder?.id) return;

    try {
      await updateDoc(doc(db, 'groupOrders', groupOrder.id), { 
        status: 'finalized',
        finalizedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to finalize order:', error);
      throw error;
    }
  };

  return (
    <GroupOrderContext.Provider
      value={{
        groupOrder,
        setGroupOrder,
        members,
        groupCart,
        createGroup,
        joinGroup,
        addItemToGroupCart,
        finalizeOrder,
        currentMember,
        leaveGroup,
      }}
    >
      {children}
    </GroupOrderContext.Provider>
  );
};

export const useGroupOrder = () => useContext(GroupOrderContext);

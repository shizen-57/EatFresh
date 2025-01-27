import React, { createContext, useState, useContext, useEffect } from 'react';
import { db, collection, addDoc, updateDoc, doc, getDoc, onSnapshot } from '../../../../firebase';

export const GroupOrderContext = createContext();

export const GroupOrderProvider = ({ children }) => {
  const [groupOrder, setGroupOrder] = useState(null);
  const [members, setMembers] = useState([]);
  const [groupCart, setGroupCart] = useState([]);

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
      return true;
    } catch (error) {
      console.error('Join group error:', error);
      throw error;
    }
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
      }}
    >
      {children}
    </GroupOrderContext.Provider>
  );
};

export const useGroupOrder = () => useContext(GroupOrderContext);

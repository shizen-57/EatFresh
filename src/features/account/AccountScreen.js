import React, { useEffect, useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator, 
  Image, 
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert
} from "react-native";
import { auth, db, storage } from "../../../firebase";
import { collection, query, where, getDocs, updateDoc, doc, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SWIGGY_COLORS = {
  primary: '#fc8019',
  secondary: '#ffa700',
  background: '#ffffff',
  text: '#3d4152'
};

export default function AccountScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [singleOrders, setSingleOrders] = useState([]);
  const [cateringOrders, setCateringOrders] = useState([]);
  const [groupOrders, setGroupOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('single');

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserInfo(user.uid);
        fetchAllOrders(user.uid);
      } else {
        setUser(null);
        setUserInfo(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserInfo = async (uid) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        setUserInfo(userDoc.data());
      } else {
        setError("User information not found");
      }
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOrders = async (uid) => {
    try {
      await Promise.all([
        fetchSingleOrders(uid),
        fetchCateringOrders(uid),
        fetchGroupOrders(uid)
      ]);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const fetchSingleOrders = async (uid) => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );
      
      try {
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setSingleOrders(orders);
      } catch (indexError) {
        // Fallback query without ordering while index is being created
        const simpleQuery = query(ordersRef, where("userId", "==", uid));
        const snapshot = await getDocs(simpleQuery);
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setSingleOrders(orders);
      }
    } catch (error) {
      console.error("Error fetching single orders:", error);
      setSingleOrders([]);
    }
  };

  const fetchCateringOrders = async (uid) => {
    try {
      const ordersRef = collection(db, "cateringOrders");
      const q = query(
        ordersRef,
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );
      
      try {
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setCateringOrders(orders);
      } catch (indexError) {
        // Fallback query without ordering while index is being created
        const simpleQuery = query(ordersRef, where("userId", "==", uid));
        const snapshot = await getDocs(simpleQuery);
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setCateringOrders(orders);
      }
    } catch (error) {
      console.error("Error fetching catering orders:", error);
      setCateringOrders([]);
    }
  };

  const fetchGroupOrders = async (uid) => {
    try {
      const ordersRef = collection(db, "groupOrders_completed");
      const q = query(
        ordersRef,
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );
      
      try {
        const snapshot = await getDocs(q);
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setGroupOrders(orders);
      } catch (indexError) {
        // Fallback query without ordering while index is being created
        const simpleQuery = query(ordersRef, where("userId", "==", uid));
        const snapshot = await getDocs(simpleQuery);
        const orders = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date()
        }));
        setGroupOrders(orders);
      }
    } catch (error) {
      console.error("Error fetching group orders:", error);
      setGroupOrders([]);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderOrderItem = (order, type) => {
    if (!order) return null;
    
    return (
      <View style={styles.orderCard} key={order.id}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderType}>{type}</Text>
          <Text style={styles.orderDate}>
            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'No date'}
          </Text>
        </View>
        <View style={styles.orderDetails}>
          <Text style={styles.orderTotal}>
            Total: ${order.total ? order.total.toFixed(2) : '0.00'}
          </Text>
          <Text style={styles.orderStatus}>
            Status: {order.status || 'Unknown'}
          </Text>
        </View>
        {order.items && Array.isArray(order.items) && (
          <View style={styles.itemsList}>
            {order.items.map((item, index) => (
              <Text key={index} style={styles.itemText}>
                • {item.quantity || 1}x {item.name || 'Unknown Item'}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to view your account information.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={[SWIGGY_COLORS.primary, SWIGGY_COLORS.secondary]}
        style={styles.headerContainer}
      >
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>{userInfo?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </LinearGradient>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <MaterialIcons name="person" size={24} color={SWIGGY_COLORS.primary} style={styles.icon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{userInfo?.name || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialIcons name="phone" size={24} color={SWIGGY_COLORS.primary} style={styles.icon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{userInfo?.phone || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialIcons name="location-on" size={24} color="#FF6B6B" style={styles.icon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{userInfo?.location || 'Not set'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.orderSection}>
        <Text style={styles.sectionTitle}>Order History</Text>
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'single' && styles.activeTab]}
            onPress={() => setActiveTab('single')}
          >
            <Text style={[styles.tabText, activeTab === 'single' && styles.activeTabText]}>
              Single Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'catering' && styles.activeTab]}
            onPress={() => setActiveTab('catering')}
          >
            <Text style={[styles.tabText, activeTab === 'catering' && styles.activeTabText]}>
              Catering Orders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'group' && styles.activeTab]}
            onPress={() => setActiveTab('group')}
          >
            <Text style={[styles.tabText, activeTab === 'group' && styles.activeTabText]}>
              Group Orders
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orderList}>
          {activeTab === 'single' && singleOrders.map(order => renderOrderItem(order, 'Single Order'))}
          {activeTab === 'catering' && cateringOrders.map(order => renderOrderItem(order, 'Catering Order'))}
          {activeTab === 'group' && groupOrders.map(order => renderOrderItem(order, 'Group Order'))}
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <MaterialIcons name="logout" size={24} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    paddingVertical: 20, // Reduced padding since we removed the profile image
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  infoSection: {
    padding: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 2,
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  orderSection: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: SWIGGY_COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  orderList: {
    marginTop: 10,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  orderDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderTotal: {
    fontSize: 15,
    fontWeight: '500',
  },
  orderStatus: {
    fontSize: 15,
    color: '#4CAF50',
  },
  itemsList: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: SWIGGY_COLORS.primary,
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
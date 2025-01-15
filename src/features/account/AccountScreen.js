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
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function AccountScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

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

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        setUploading(true);
        const uploadUrl = await uploadImageAsync(result.uri);
        await updateUserProfile(uploadUrl);
        setUploading(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to update profile picture");
      setUploading(false);
    }
  };

  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        resolve(xhr.response);
      };
      xhr.onerror = (e) => {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const fileRef = ref(storage, `profilePics/${user.uid}`);
    await uploadBytes(fileRef, blob);
    blob.close();

    return await getDownloadURL(fileRef);
  };

  const updateUserProfile = async (imageUrl) => {
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      profilePicture: imageUrl
    });
    fetchUserInfo(user.uid);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        colors={['#FF6B6B', '#FFE66D']}
        style={styles.headerContainer}
      >
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage} style={styles.profileImageContainer}>
            {uploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Image
                  source={userInfo?.profilePicture ? { uri: userInfo.profilePicture } : require('../../../assets/logo.png')}
                  style={styles.profileImage}
                />
                <View style={styles.editIconContainer}>
                  <MaterialIcons name="edit" size={20} color="#fff" />
                </View>
              </>
            )}
          </TouchableOpacity>
          <Text style={styles.userName}>{userInfo?.name || 'User'}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
      </LinearGradient>

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <MaterialIcons name="person" size={24} color="#FF6B6B" style={styles.icon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{userInfo?.name || 'Not set'}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <MaterialIcons name="phone" size={24} color="#FF6B6B" style={styles.icon} />
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
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    elevation: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B6B',
    padding: 8,
    borderRadius: 20,
    elevation: 5,
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
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF6B6B',
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
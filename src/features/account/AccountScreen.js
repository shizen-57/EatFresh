import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AccountScreen() {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchUserInfo(user.uid);
      } else {
        setUser(null);
        setUserInfo(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserInfo = async (uid) => {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      setUserInfo(userDoc.data());
    } else {
      console.log("No such document!");
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text>Please log in to view your account information.</Text>
      </View>
    );
  }

  if (!userInfo) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Information</Text>
      <Text style={styles.label}>Name: {userInfo.name}</Text>
      <Text style={styles.label}>Email: {user.email}</Text>
      <Text style={styles.label}>Phone: {userInfo.phone}</Text>
      <Text style={styles.label}>Location: {userInfo.location}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useGroupOrder } from '../context/GroupOrderContext';
import { Ionicons } from '@expo/vector-icons';
import { db, doc, getDoc } from '../../../../firebase';

export default function ScanQRCodeScreen({ navigation }) {
  const [scanned, setScanned] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const { joinGroup } = useGroupOrder();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionMessage}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    try {
      const parsedData = JSON.parse(data);
      
      if (!parsedData.groupId) {
        Alert.alert('Error', 'Invalid QR code');
        return;
      }

      // Fetch complete group data from Firestore
      const groupDoc = await getDoc(doc(db, 'groupOrders', parsedData.groupId));
      
      if (!groupDoc.exists()) {
        Alert.alert('Error', 'Group not found');
        return;
      }

      const groupData = {
        ...groupDoc.data(),
        groupId: parsedData.groupId,
        restaurantId: groupDoc.data().restaurantId,
        creatorName: groupDoc.data().creator,
        restaurantName: groupDoc.data().restaurantName
      };

      navigation.navigate('JoinGroup', { 
        groupData: groupData, 
        fromQRCode: true 
      });
    } catch (error) {
      console.error('Error scanning QR code:', error);
      Alert.alert('Error', 'Failed to scan QR code');
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.squareBox}>
            <Text style={styles.scanText}>Position QR code within frame</Text>
          </View>
        </View>
      </CameraView>
      {scanned && (
        <TouchableOpacity style={styles.scanAgainButton} onPress={() => setScanned(false)}>
          <Ionicons name="refresh" size={24} color="white" />
          <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  permissionMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareBox: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  scanText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
  },
  scanAgainButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ea',
    padding: 15,
    borderRadius: 8,
    margin: 20,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});
import React from 'react';
import { View, StyleSheet } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function QRCodeGenerator({ groupData }) {
  // Only encode the groupId
  const qrData = JSON.stringify({
    groupId: groupData.id
  });

  return (
    <View style={styles.container}>
      <QRCode
        value={qrData}
        size={250}
        backgroundColor="white"
        color="black"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 3,
  },
});

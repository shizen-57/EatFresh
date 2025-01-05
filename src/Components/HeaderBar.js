import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from './safe_area.component';

const HeaderBar = () => {
    return (
        <SafeArea>
            <View style={styles.header}>
                <Ionicons name="location" size={30} color="black" />
                <View>
                    <Text style={styles.locationText}>Location</Text>
                    <Text style={styles.locationNameText}>Dhaka</Text>
                </View>
            </View>
        </SafeArea>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 5,
        backgroundColor: '#ffebcd',
        paddingHorizontal: 30,
    },
    locationText: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: 'bold',
    },
    locationNameText: {
        marginLeft: 10,
        fontSize: 15,
        fontWeight: 'bold',
    },
});

export default HeaderBar;
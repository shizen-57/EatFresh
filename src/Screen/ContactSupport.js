// src/Screen/ContactSupport.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ContactSupport = ({ navigation }) => {
    const handleEmailPress = () => {
        Linking.openURL('mailto:fariayasmin19@gmail.com');
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Contact Support</Text>

                <View style={styles.teamCard}>
                    <Icon name="group" size={50} color="#4CAF50" />
                    <Text style={styles.teamName}>Built_it_better</Text>
                    <Text style={styles.teamDescription}>
                        We're here to help you with any questions or concerns about our platform.
                        Our dedicated support team ensures quick and efficient assistance for all restaurant partners.
                    </Text>
                </View>

                <View style={styles.contactCard}>
                    <TouchableOpacity style={styles.contactItem} onPress={handleEmailPress}>
                        <Icon name="email" size={24} color="#4CAF50" />
                        <Text style={styles.contactText}>fariayasmin19@gmail.com</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.contactItem}>
                        <Icon name="access-time" size={24} color="#4CAF50" />
                        <Text style={styles.contactText}>Response Time: Within 24 hours</Text>
                    </View>

                    <View style={styles.contactItem}>
                        <Icon name="schedule" size={24} color="#4CAF50" />
                        <Text style={styles.contactText}>Support Hours: 9 AM - 10 PM</Text>
                    </View>
                </View>

                <View style={styles.supportInfo}>
                    <Text style={styles.supportTitle}>How We Can Help</Text>
                    <View style={styles.supportItem}>
                        <Icon name="help" size={20} color="#4CAF50" />
                        <Text style={styles.supportText}>Technical Support</Text>
                    </View>
                    <View style={styles.supportItem}>
                        <Icon name="verified-user" size={20} color="#4CAF50" />
                        <Text style={styles.supportText}>Account Verification</Text>
                    </View>
                    <View style={styles.supportItem}>
                        <Icon name="settings" size={20} color="#4CAF50" />
                        <Text style={styles.supportText}>Platform Guidance</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 15,
        marginTop: 40,
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    teamCard: {
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
    },
    teamName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#333',
    },
    teamDescription: {
        textAlign: 'center',
        color: '#666',
        lineHeight: 20,
    },
    contactCard: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    contactText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    supportInfo: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        elevation: 2,
    },
    supportTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    supportItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    supportText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#666',
    },
});

export default ContactSupport;
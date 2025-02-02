// src/Screen/HowItWorks.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HowItWorks = ({ navigation }) => {
    const steps = [
        {
            title: "Register Your Restaurant",
            description: "Fill out the registration form with your restaurant's details and verify your identity.",
            icon: "app-registration"
        },
        {
            title: "Complete Verification",
            description: "Our team will verify your documents and approve your restaurant.",
            icon: "verified"
        },
        {
            title: "Setup Your Menu",
            description: "Add your menu items, prices, and special offers through the dashboard.",
            icon: "restaurant-menu"
        },
        {
            title: "Start Receiving Orders",
            description: "Accept orders and manage your business through our platform.",
            icon: "point-of-sale"
        }
    ];

    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={24} color="#333" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>How It Works</Text>

                {steps.map((step, index) => (
                    <View key={index} style={styles.stepCard}>
                        <Icon name={step.icon} size={40} color="#4CAF50" />
                        <Text style={styles.stepTitle}>{step.title}</Text>
                        <Text style={styles.stepDescription}>{step.description}</Text>
                    </View>
                ))}
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
    stepCard: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 2,
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    stepDescription: {
        textAlign: 'center',
        color: '#666',
        lineHeight: 20,
    },
});

export default HowItWorks;
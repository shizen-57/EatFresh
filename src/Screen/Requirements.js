// src/Screen/Requirements.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Requirements = ({ navigation }) => {
    const requirements = [
        {
            title: "Legal Documents",
            items: [
                "Valid Trade License",
                "Food Safety Certificate",
                "Tax Identification Number",
                "Owner's NID"
            ],
            icon: "description"
        },
        {
            title: "Restaurant Information",
            items: [
                "Restaurant Name and Logo",
                "Complete Address",
                "Contact Information",
                "Restaurant Photos"
            ],
            icon: "info"
        },
        {
            title: "Operational Requirements",
            items: [
                "Standard Menu with Prices",
                "Operating Hours",
                "Delivery Coverage Area",
                "Payment Methods Accepted"
            ],
            icon: "settings"
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
                <Text style={styles.title}>Requirements</Text>

                {requirements.map((section, index) => (
                    <View key={index} style={styles.requirementCard}>
                        <Icon name={section.icon} size={30} color="#4CAF50" />
                        <Text style={styles.requirementTitle}>{section.title}</Text>
                        {section.items.map((item, idx) => (
                            <View key={idx} style={styles.requirementItem}>
                                <Icon name="check-circle" size={20} color="#4CAF50" />
                                <Text style={styles.requirementText}>{item}</Text>
                            </View>
                        ))}
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
    requirementCard: {
        backgroundColor: '#f8f8f8',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
    },
    requirementTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    requirementText: {
        marginLeft: 10,
        color: '#666',
        fontSize: 16,
    },
});

export default Requirements;
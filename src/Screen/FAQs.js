// src/Screen/FAQs.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FAQs = ({ navigation }) => {
    const [expandedIndex, setExpandedIndex] = useState(null);

    const faqs = [
        {
            question: "How long does the registration process take?",
            answer: "The registration process typically takes 2-3 business days. This includes document verification and account setup."
        },
        {
            question: "What are the commission rates?",
            answer: "Commission rates vary based on your restaurant type and location. Contact our support team for detailed information."
        },
        {
            question: "Can I update my menu after registration?",
            answer: "Yes, you can update your menu items, prices, and availability at any time through your restaurant dashboard."
        },
        {
            question: "How do I receive orders?",
            answer: "You'll receive orders through our restaurant dashboard and mobile app. You can also enable email and SMS notifications."
        },
        {
            question: "What payment methods are supported?",
            answer: "We support various payment methods including cash on delivery, credit/debit cards, and mobile banking."
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
                <Text style={styles.title}>Frequently Asked Questions</Text>

                {faqs.map((faq, index) => (
                    <TouchableOpacity 
                        key={index}
                        style={styles.faqCard}
                        onPress={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    >
                        <View style={styles.faqHeader}>
                            <Text style={styles.faqQuestion}>{faq.question}</Text>
                            <Icon 
                                name={expandedIndex === index ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
                                size={24} 
                                color="#333"
                            />
                        </View>
                        {expandedIndex === index && (
                            <Text style={styles.faqAnswer}>{faq.answer}</Text>
                        )}
                    </TouchableOpacity>
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
    faqCard: {
        backgroundColor: '#f8f8f8',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        elevation: 2,
    },
    faqHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
        marginRight: 10,
    },
    faqAnswer: {
        marginTop: 10,
        color: '#666',
        lineHeight: 20,
    },
});

export default FAQs;
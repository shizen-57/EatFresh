// src/Screen/Home.js
import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    ScrollView,
    TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RegisterRestaurant from './RegisterRestaurant';

const Home = ({ navigation }) => {
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const MainContent = () => (
        <View style={styles.welcomeContainer}>
            <Icon name="restaurant" size={80} color="#4CAF50" />
            <Text style={styles.welcomeTitle}>Welcome to EatFresh</Text>
            <Text style={styles.welcomeMessage}>
                Tap the menu icon in the top left to:
            </Text>
            <View style={styles.instructionContainer}>
                <View style={styles.instructionItem}>
                    <Icon name="arrow-right" size={20} color="#4CAF50" />
                    <Text style={styles.instructionText}>Register your restaurant</Text>
                </View>
                <View style={styles.instructionItem}>
                    <Icon name="arrow-right" size={20} color="#4CAF50" />
                    <Text style={styles.instructionText}>Add your menu items after registration</Text>
                </View>
                <View style={styles.instructionItem}>
                    <Icon name="arrow-right" size={20} color="#4CAF50" />
                    <Text style={styles.instructionText}>Start receiving orders</Text>
                </View>
            </View>
        </View>
    );

    const Sidebar = () => (
        <View style={styles.sidebar}>
            <View style={styles.sidebarHeader}>
                <View style={styles.headerIcon}>
                    <Icon name="restaurant-menu" size={32} color="#4CAF50" />
                </View>
                <Text style={styles.sidebarTitle}>Restaurant Panel</Text>
                <Text style={styles.sidebarSubtitle}>Grow your business with us</Text>
            </View>

            <ScrollView style={styles.sidebarContent}>
                {/* Registration Section */}
                <View style={styles.sidebarSection}>
                    <Text style={styles.sectionTitle}>Get Started</Text>
                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => {
                            setModalVisible(true);
                            setSidebarVisible(false);
                        }}
                    >
                        <Icon name="add-business" size={24} color="#4CAF50" />
                        <Text style={styles.sidebarText}>Register Restaurant</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => {
                            setSidebarVisible(false);
                            navigation.navigate('OwnerLogin');
                        }}
                    >
                        <Icon name="login" size={24} color="#4CAF50" />
                        <Text style={styles.sidebarText}>Login as Owner</Text>
                    </TouchableOpacity>
                </View>

                {/* Information Section */}
                <View style={styles.sidebarSection}>
                    <Text style={styles.sectionTitle}>Information</Text>
                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => {
                            setSidebarVisible(false);
                            navigation.navigate('HowItWorks');
                        }}
                    >
                        <Icon name="info" size={24} color="#4CAF50" />
                        <Text style={styles.sidebarText}>How it Works</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => {
                            setSidebarVisible(false);
                            navigation.navigate('Requirements');
                        }}
                    >
                        <Icon name="description" size={24} color="#4CAF50" />
                        <Text style={styles.sidebarText}>Requirements</Text>
                    </TouchableOpacity>
                </View>

                {/* Help Section */}
                <View style={styles.sidebarSection}>
                    <Text style={styles.sectionTitle}>Help & Support</Text>
                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => {
                            setSidebarVisible(false);
                            navigation.navigate('ContactSupport');
                        }}
                    >
                        <Icon name="support-agent" size={24} color="#4CAF50" />
                        <Text style={styles.sidebarText}>Contact Support</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.sidebarItem}
                        onPress={() => {
                            setSidebarVisible(false);
                            navigation.navigate('FAQs');
                        }}
                    >
                        <Icon name="help" size={24} color="#4CAF50" />
                        <Text style={styles.sidebarText}>FAQs</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Section */}
                <View style={styles.sidebarFooter}>
                    <Text style={styles.footerText}>Join our growing network of</Text>
                    <Text style={styles.footerHighlight}>1000+ Restaurant Partners</Text>
                </View>
            </ScrollView>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Sidebar Icon */}
            <TouchableOpacity 
                style={styles.menuButton}
                onPress={() => setSidebarVisible(!sidebarVisible)}
            >
                <Icon name="menu" size={30} color="#333" />
            </TouchableOpacity>

            {/* Main Content */}
            <View style={styles.content}>
                <MainContent />
            </View>

            {/* Sidebar with overlay */}
            {sidebarVisible && (
                <TouchableWithoutFeedback onPress={() => setSidebarVisible(false)}>
                    <View style={styles.overlay}>
                        <TouchableWithoutFeedback>
                            <Sidebar />
                        </TouchableWithoutFeedback>
                    </View>
                </TouchableWithoutFeedback>
            )}

            {/* Registration Modal */}
            <RegisterRestaurant 
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    welcomeContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    welcomeMessage: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    instructionContainer: {
        width: '100%',
        paddingHorizontal: 20,
    },
    instructionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
    },
    instructionText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 10,
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1,
    },
    menuButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 2,
        padding: 8,
    },
    content: {
        flex: 1,
    },
    sidebar: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 300,
        height: '100%',
        backgroundColor: '#fff',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 2,
    },
    sidebarHeader: {
        padding: 20,
        paddingTop: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        backgroundColor: '#f8f8f8',
        alignItems: 'center',
    },
    headerIcon: {
        width: 60,
        height: 60,
        backgroundColor: '#e8f5e9',
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    sidebarTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    sidebarSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    sidebarContent: {
        flex: 1,
    },
    sidebarSection: {
        paddingTop: 15,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    sidebarItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        paddingHorizontal: 20,
    },
    sidebarText: {
        marginLeft: 15,
        fontSize: 16,
        color: '#333',
    },
    sidebarFooter: {
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#f8f8f8',
        marginTop: 20,
    },
    footerText: {
        fontSize: 14,
        color: '#666',
    },
    footerHighlight: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginTop: 5,
    }
});

export default Home;
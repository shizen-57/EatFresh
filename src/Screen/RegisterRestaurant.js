import React, { useState, useCallback, memo } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    Modal, 
    TextInput, 
    ScrollView,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import { ref, set } from 'firebase/database';
import { realtimeDb } from '../../firebase';

// Moved outside and memoized to prevent re-renders
const InputField = memo(({ label, error, ...props }) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholderTextColor="#666"
            {...props}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
));

const getRandomLocation = () => {
    const locations = [
        { address1: "Dhanmondi", city: "Dhaka", state: "Dhaka", zip_code: "1205", latitude: 23.8103, longitude: 90.4125 },
        { address1: "Banani", city: "Dhaka", state: "Dhaka", zip_code: "1213", latitude: 23.8189, longitude: 90.4 },
        { address1: "Gulshan", city: "Dhaka", state: "Dhaka", zip_code: "1212", latitude: 23.7938, longitude: 90.3964 },
        { address1: "Uttara", city: "Dhaka", state: "Dhaka", zip_code: "1230", latitude: 23.8741, longitude: 90.4027 },
        { address1: "Mirpur", city: "Dhaka", state: "Dhaka", zip_code: "1216", latitude: 23.822, longitude: 90.367 }
    ];
    return locations[Math.floor(Math.random() * locations.length)];
};

const RegisterRestaurant = ({ visible, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        restaurantName: '',
        ownerName: '',
        email: '',
        password: '',
        phone: '',
        nidNumber: ''
    });

    // Memoize form update handlers
    const handleFieldChange = useCallback((field) => (text) => {
        setFormData(prev => ({
            ...prev,
            [field]: text
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    }, [errors]);

    const validateForm = useCallback(() => {
        let tempErrors = {};
        
        if (!formData.restaurantName.trim()) {
            tempErrors.restaurantName = 'Restaurant name is required';
        }
        if (!formData.ownerName.trim()) {
            tempErrors.ownerName = 'Owner name is required';
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            tempErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            tempErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            tempErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            tempErrors.password = 'Password must be at least 6 characters';
        }
        const phoneRegex = /^[0-9]{11}$/;
        if (!formData.phone) {
            tempErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(formData.phone)) {
            tempErrors.phone = 'Please enter a valid 11-digit phone number';
        }
        const nidRegex = /^[0-9]{10,17}$/;
        if (!formData.nidNumber) {
            tempErrors.nidNumber = 'NID number is required';
        } else if (!nidRegex.test(formData.nidNumber)) {
            tempErrors.nidNumber = 'Please enter a valid NID number';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }, [formData]);

    const handleSubmit = useCallback(async () => {
        if (validateForm()) {
            setIsLoading(true);
            try {
                const userCredential = await createUserWithEmailAndPassword(
                    auth, 
                    formData.email, 
                    formData.password
                );

                const userId = userCredential.user.uid;
                const restaurantId = `restaurant_${userId}`;
                const location = getRandomLocation();

                // Add user exactly like in the JSON structure
                const userRef = ref(realtimeDb, `users/${userId}`);
                await set(userRef, {
                    name: formData.ownerName,
                    email: formData.email,
                    restaurants: [restaurantId]
                });

                // Create restaurant matching the JSON structure exactly
                await set(ref(realtimeDb, `restaurants/${restaurantId}`), {
                    owner: userId,
                    name: formData.restaurantName,
                    location: location,
                    image_url: "https://via.placeholder.com/150",
                    transactions: ["delivery"],
                    categories: ["new"],
                    price: "$",
                    rating: 0,
                    review_count: 0,
                    menu: []  // Initialize as empty array
                });

                // Store additional info in Firestore
                await setDoc(doc(firestore, 'restaurant_owners', userId), {
                    restaurantId,
                    restaurantName: formData.restaurantName,
                    ownerName: formData.ownerName,
                    email: formData.email,
                    phone: formData.phone,
                    nidNumber: formData.nidNumber,
                    status: 'pending',
                    createdAt: new Date().toISOString()
                });

                await sendEmailVerification(userCredential.user);

                Alert.alert(
                    "Success", 
                    "Registration successful! Please verify your email.",
                    [{ 
                        text: "OK", 
                        onPress: () => {
                            onClose();
                            resetForm();
                        }
                    }]
                );
            } catch (error) {
                console.error('Registration error:', error);
                
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('Error', 'This email is already registered. Please use a different email or try logging in.');
                } else {
                    Alert.alert('Error', 'Registration failed. Please try again.');
                }
            } finally {
                setIsLoading(false);
            }
        }
    }, [formData, validateForm, onClose, resetForm]);

    const resetForm = useCallback(() => {
        setFormData({
            restaurantName: '',
            ownerName: '',
            email: '',
            password: '',
            phone: '',
            nidNumber: ''
        });
        setErrors({});
    }, []);

    const handleClose = useCallback(() => {
        if (!isLoading) {
            onClose();
            resetForm();
        }
    }, [isLoading, onClose, resetForm]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView 
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.keyboardView}
                keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Restaurant Registration</Text>
                            {!isLoading && (
                                <TouchableOpacity 
                                    onPress={handleClose}
                                    style={styles.closeButton}
                                >
                                    <Icon name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            )}
                        </View>

                        <ScrollView 
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.scrollContent}
                        >
                            <InputField
                                label="Restaurant Name"
                                placeholder="Enter restaurant name"
                                value={formData.restaurantName}
                                onChangeText={handleFieldChange('restaurantName')}
                                error={errors.restaurantName}
                                editable={!isLoading}
                            />
                            
                            <InputField
                                label="Owner Name"
                                placeholder="Enter owner's full name"
                                value={formData.ownerName}
                                onChangeText={handleFieldChange('ownerName')}
                                error={errors.ownerName}
                                editable={!isLoading}
                            />
                            
                            <InputField
                                label="Email Address"
                                placeholder="Enter email address"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={handleFieldChange('email')}
                                error={errors.email}
                                editable={!isLoading}
                            />
                            
                            <InputField
                                label="Password"
                                placeholder="Enter password"
                                secureTextEntry
                                value={formData.password}
                                onChangeText={handleFieldChange('password')}
                                error={errors.password}
                                editable={!isLoading}
                            />
                            
                            <InputField
                                label="Phone Number"
                                placeholder="Enter 11-digit phone number"
                                keyboardType="phone-pad"
                                value={formData.phone}
                                onChangeText={handleFieldChange('phone')}
                                error={errors.phone}
                                editable={!isLoading}
                                maxLength={11}
                            />

                            <InputField
                                label="NID Card Number"
                                placeholder="Enter NID number"
                                keyboardType="numeric"
                                value={formData.nidNumber}
                                onChangeText={handleFieldChange('nidNumber')}
                                error={errors.nidNumber}
                                editable={!isLoading}
                            />

                            <View style={styles.buttonContainer}>
                                {isLoading ? (
                                    <View style={styles.loadingButton}>
                                        <ActivityIndicator color="#fff" />
                                        <Text style={[styles.buttonText, styles.loadingText]}>
                                            Registering...
                                        </Text>
                                    </View>
                                ) : (
                                    <View style={styles.buttonRow}>
                                        <TouchableOpacity 
                                            style={styles.registerButton}
                                            onPress={handleSubmit}
                                        >
                                            <Text style={styles.buttonText}>Register</Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            style={styles.cancelButton}
                                            onPress={handleClose}
                                        >
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        maxHeight: '80%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    inputContainer: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
        fontWeight: '500',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f8f8f8',
        color: '#333',
    },
    inputError: {
        borderColor: '#ff4444',
    },
    errorText: {
        color: '#ff4444',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 5,
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    registerButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    cancelButton: {
        backgroundColor: '#ff4444',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    loadingButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingText: {
        marginLeft: 10,
    }
});

export default RegisterRestaurant;
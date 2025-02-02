import React, { useState, useEffect, memo, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signOut } from 'firebase/auth';
import { 
    ref, 
    get,
    set,
    push,
    remove,
    update,
    query,
    orderByChild,
    equalTo
} from 'firebase/database';
import { auth, realtimeDb } from '../../firebase';

// Memoized Components
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

const InfoItem = memo(({ icon, label, value }) => (
    <View style={styles.infoItem}>
        <Icon name={icon} size={20} color="#4CAF50" />
        <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
        </View>
    </View>
));

const MenuItem = memo(({ item, index, onEdit, onDelete, onToggleAvailability }) => (
    <View style={styles.menuItem}>
        <View style={styles.menuItemHeader}>
            <Text style={styles.menuItemName}>{item.name}</Text>
            <View style={styles.menuItemActions}>
                <TouchableOpacity 
                    style={[
                        styles.availabilityButton, 
                        !item.isAvailable && styles.unavailableButton
                    ]}
                    onPress={() => onToggleAvailability(item.id)}
                >
                    <Text style={[
                        styles.availabilityText,
                        !item.isAvailable && styles.unavailabilityText
                    ]}>
                        {item.isAvailable ? 'Available' : 'Unavailable'}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => onEdit(item)}
                    style={styles.actionButton}
                >
                    <Icon name="edit" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity 
                    onPress={() => onDelete(item.id)}
                    style={styles.actionButton}
                >
                    <Icon name="delete" size={20} color="#ff4444" />
                </TouchableOpacity>
            </View>
        </View>
        <Text style={styles.menuItemDescription}>{item.description}</Text>
        <Text style={styles.menuItemPrice}>৳{item.price}</Text>
        <Text style={styles.menuItemCategory}>{item.dish_type.join(', ')}</Text>
    </View>
));

const AdminProfile = ({ navigation }) => {
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [newMenuItem, setNewMenuItem] = useState({
        name: '',
        description: '',
        price: '',
        dish_type: [],
        customizable: true,
        options: {
            portion_size: [
                { id: 'portion1', name: 'Regular', price: 0 },
                { id: 'portion2', name: 'Large', price: 200 }
            ],
            spice_level: [
                { id: 'spice1', name: 'Mild', price: 0 },
                { id: 'spice2', name: 'Medium', price: 0 },
                { id: 'spice3', name: 'Spicy', price: 0 }
            ],
            add_ons: []
        },
        isAvailable: true
    });

    const [errors, setErrors] = useState({});
    const currentUser = auth.currentUser;

    useEffect(() => {
        if (currentUser) {
            fetchRestaurantData();
        }
    }, [currentUser]);

    const fetchRestaurantData = async () => {
        try {
            // Fetch restaurant info using orderByChild
            const restaurantsRef = ref(realtimeDb, 'restaurants');
            const restaurantQuery = query(
                restaurantsRef, 
                orderByChild('owner'),
                equalTo(currentUser.uid)
            );
            
            const snapshot = await get(restaurantQuery);
            if (snapshot.exists()) {
                // Get the first restaurant owned by this user
                const restaurants = Object.values(snapshot.val());
                const restaurantData = restaurants[0];
                setRestaurantInfo(restaurantData);

                // Then fetch menu items for this restaurant
                if (restaurantData.id) {
                    const menuItemsRef = ref(realtimeDb, 'menuItems');
                    const menuSnapshot = await get(menuItemsRef);
                    
                    if (menuSnapshot.exists()) {
                        const allItems = menuSnapshot.val();
                        const restaurantItems = Object.entries(allItems)
                            .filter(([_, item]) => item.restaurantId === restaurantData.id)
                            .map(([id, item]) => ({
                                id,
                                ...item
                            }));
                        setMenuItems(restaurantItems);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            Alert.alert('Error', 'Failed to load restaurant data');
        }
    };

    const handleSignOut = useCallback(() => {
        Alert.alert(
            "Sign Out",
            "Are you sure you want to sign out?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Sign Out",
                    onPress: async () => {
                        try {
                            await signOut(auth);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Home' }],
                            });
                        } catch (error) {
                            console.error('Sign out error:', error);
                            Alert.alert('Error', 'Failed to sign out');
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    }, [navigation]);

    const validateMenuItem = useCallback(() => {
        let tempErrors = {};
        
        if (!newMenuItem.name.trim()) {
            tempErrors.name = 'Item name is required';
        }
        if (!newMenuItem.description.trim()) {
            tempErrors.description = 'Description is required';
        }
        if (!newMenuItem.price.trim()) {
            tempErrors.price = 'Price is required';
        } else if (isNaN(newMenuItem.price)) {
            tempErrors.price = 'Price must be a number';
        }
        if (!newMenuItem.dish_type.length) {
            tempErrors.dish_type = 'At least one dish type is required';
        }

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    }, [newMenuItem]);

    const handleAddMenuItem = useCallback(async () => {
        if (validateMenuItem()) {
            try {
                const menuItemData = {
                    ...newMenuItem,
                    restaurantId: restaurantInfo.id,
                    price: parseFloat(newMenuItem.price),
                    image_url: `https://example.com/images/${newMenuItem.name.toLowerCase().replace(/\s+/g, '_')}.jpg`
                };

                if (editingItem) {
                    // Update existing item
                    await update(
                        ref(realtimeDb, `menuItems/${editingItem.id}`),
                        menuItemData
                    );
                } else {
                    // Add new item
                    await push(
                        ref(realtimeDb, 'menuItems'),
                        menuItemData
                    );
                }

                await fetchRestaurantData();
                Alert.alert(
                    "Success", 
                    editingItem ? "Menu item updated successfully!" : "Menu item added successfully!"
                );
                resetForm();
            } catch (error) {
                Alert.alert("Error", "Failed to save menu item");
            }
        }
    }, [newMenuItem, editingItem, restaurantInfo, validateMenuItem]);

    const resetForm = useCallback(() => {
        setNewMenuItem({
            name: '',
            description: '',
            price: '',
            dish_type: [],
            customizable: true,
            options: {
                portion_size: [
                    { id: 'portion1', name: 'Regular', price: 0 },
                    { id: 'portion2', name: 'Large', price: 200 }
                ],
                spice_level: [
                    { id: 'spice1', name: 'Mild', price: 0 },
                    { id: 'spice2', name: 'Medium', price: 0 },
                    { id: 'spice3', name: 'Spicy', price: 0 }
                ],
                add_ons: []
            },
            isAvailable: true
        });
        setErrors({});
        setModalVisible(false);
        setEditingItem(null);
    }, []);

    const editItem = useCallback((item) => {
        setEditingItem(item);
        setNewMenuItem(item);
        setModalVisible(true);
    }, []);

    const deleteItem = useCallback((itemId) => {
        Alert.alert(
            "Delete Item",
            "Are you sure you want to delete this item?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await remove(ref(realtimeDb, `menuItems/${itemId}`));
                            await fetchRestaurantData();
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete menu item");
                        }
                    },
                    style: "destructive"
                }
            ]
        );
    }, []);

    const toggleAvailability = useCallback(async (itemId) => {
        try {
            const item = menuItems.find(item => item.id === itemId);
            await update(
                ref(realtimeDb, `menuItems/${itemId}`),
                { isAvailable: !item.isAvailable }
            );
            await fetchRestaurantData();
        } catch (error) {
            Alert.alert("Error", "Failed to update item availability");
        }
    }, [menuItems]);

    const handleInputChange = useCallback((field, value) => {
        setNewMenuItem(prev => ({
            ...prev,
            [field]: value
        }));
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    }, [errors]);

    return (
        <View style={styles.container}>
            {/* Header with Sign Out */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Restaurant Profile</Text>
                <TouchableOpacity 
                    style={styles.signOutButton}
                    onPress={handleSignOut}
                >
                    <Icon name="logout" size={24} color="#ff4444" />
                </TouchableOpacity>
            </View>

            <ScrollView>
                {/* Restaurant Info Section */}
                <View style={styles.section}>
                    <View style={styles.profileHeader}>
                        <View style={styles.restaurantIconContainer}>
                            <Icon name="restaurant" size={40} color="#4CAF50" />
                        </View>
                        <Text style={styles.restaurantName}>
                            {restaurantInfo?.name || 'Loading...'}
                        </Text>
                    </View>
                    
                    <View style={styles.infoContainer}>
                        <InfoItem 
                            icon="person" 
                            label="Owner" 
                            value={restaurantInfo?.owner_name || 'N/A'} 
                        />
                        <InfoItem 
                            icon="email" 
                            label="Email" 
                            value={restaurantInfo?.email || 'N/A'} 
                        />
                        <InfoItem 
                            icon="phone" 
                            label="Phone" 
                            value={restaurantInfo?.phone || 'N/A'} 
                        />
                    </View>
                </View>

                {/* Menu Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Menu Items</Text>
                        <TouchableOpacity 
                            style={styles.addButton}
                            onPress={() => setModalVisible(true)}
                        >
                            <Icon name="add" size={24} color="#fff" />
                            <Text style={styles.addButtonText}>Add Item</Text>
                        </TouchableOpacity>
                    </View>

                    {menuItems.length === 0 ? (
                        <Text style={styles.emptyMenuText}>No menu items added yet</Text>
                    ) : (
                        menuItems.map((item, index) => (
                            <MenuItem
                                key={item.id}
                                item={item}
                                index={index}
                                onEdit={editItem}
                                onDelete={deleteItem}
                                onToggleAvailability={toggleAvailability}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Add/Edit Menu Item Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={resetForm}
            >
                <KeyboardAvoidingView 
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
                >
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>
                                        {editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
                                    </Text>
                                    <TouchableOpacity 
                                        onPress={resetForm}
                                        style={styles.closeButton}
                                    >
                                        <Icon name="close" size={24} color="#333" />
                                    </TouchableOpacity>
                                </View>

                                <ScrollView 
                                    showsVerticalScrollIndicator={false}
                                    keyboardShouldPersistTaps="handled"
                                    contentContainerStyle={styles.scrollContent}
                                >
                                    <InputField
                                        label="Item Name"
                                        placeholder="Enter item name"
                                        value={newMenuItem.name}
                                        onChangeText={(text) => handleInputChange('name', text)}
                                        error={errors.name}
                                    />
                                    
                                    <InputField
                                        label="Description"
                                        placeholder="Enter item description"
                                        value={newMenuItem.description}
                                        onChangeText={(text) => handleInputChange('description', text)}
                                        error={errors.description}
                                        multiline
                                        numberOfLines={3}
                                    />
                                    
                                    <InputField
                                        label="Price (৳)"
                                        placeholder="Enter price"
                                        value={newMenuItem.price}
                                        onChangeText={(text) => handleInputChange('price', text)}
                                        error={errors.price}
                                        keyboardType="numeric"
                                    />
                                    
                                    <InputField
                                        label="Dish Type"
                                        placeholder="Enter dish type (e.g., Appetizer, Main Course)"
                                        value={newMenuItem.dish_type.join(', ')}
                                        onChangeText={(text) => handleInputChange('dish_type', text.split(',').map(type => type.trim()))}
                                        error={errors.dish_type}
                                    />

                                    <View style={styles.buttonContainer}>
                                        <TouchableOpacity 
                                            style={styles.saveButton}
                                            onPress={handleAddMenuItem}
                                        >
                                            <Text style={styles.buttonText}>
                                                {editingItem ? 'Update Item' : 'Add Item'}
                                            </Text>
                                        </TouchableOpacity>
                                        
                                        <TouchableOpacity 
                                            style={styles.cancelButton}
                                            onPress={resetForm}
                                        >
                                            <Text style={styles.buttonText}>Cancel</Text>
                                        </TouchableOpacity>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        elevation: 2,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    signOutButton: {
        padding: 8,
    },
    section: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    profileHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    restaurantIconContainer: {
        width: 80,
        height: 80,
        backgroundColor: '#e8f5e9',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    restaurantName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    infoContainer: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    infoTextContainer: {
        marginLeft: 15,
        flex: 1,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        marginLeft: 5,
        fontWeight: '500',
    },
    emptyMenuText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 16,
        marginTop: 20,
    },
    menuItem: {
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
    },
    menuItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    menuItemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    menuItemActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionButton: {
        padding: 5,
        marginLeft: 10,
    },
    menuItemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    menuItemPrice: {
        fontSize: 16,
        fontWeight: '600',
        color: '#4CAF50',
        marginBottom: 5,
    },
    menuItemCategory: {
        fontSize: 14,
        color: '#666',
    },
    availabilityButton: {
        backgroundColor: '#e8f5e9',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
    },
    unavailableButton: {
        backgroundColor: '#ffebee',
    },
    availabilityText: {
        color: '#4CAF50',
        fontSize: 12,
        fontWeight: '500',
    },
    unavailabilityText: {
        color: '#ff4444',
    },
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
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
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
        backgroundColor: '#fff',
        color: '#333',
        minHeight: 45,
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    saveButton: {
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
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default AdminProfile;
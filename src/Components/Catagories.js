import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet } from 'react-native';

const categories = [
    { name: 'Pizza', image: require('../Images/pizza.jpg') },
    { name: 'Burger', image: require('../Images/burger.jpg') },
    { name: 'Chocolate', image: require('../Images/chocolate.jpg') },
    { name: 'Biriyani', image: require('../Images/biriyani.jpg') },
    { name: 'Teheri', image: require('../Images/teheri.jpg') },
    { name: 'Bengali', image: require('../Images/bangali_foods.jpg') },
];

const Catagories = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Categories</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollContainer}>
                {categories.map((category, index) => (
                    <View key={index} style={styles.categoryContainer}>
                        <Image source={category.image} style={styles.image} />
                        <Text style={styles.categoryName}>{category.name}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
        marginBottom: 10,
    },
    scrollContainer: {
        paddingLeft: 10,
        
    },
    categoryContainer: {
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#ffebcd',
        borderRadius: 15,
        padding: 7,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 2,
        marginBottom: 1,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    categoryName: {
        marginTop: 5,
        fontSize: 14,
        fontWeight: '500',
    },
});

export default Catagories;
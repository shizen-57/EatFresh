import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import React, { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

const Splash = () => {
    const navigation = useNavigation();
    
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.navigate('Onboard')
        }, 3000);
        return () => clearTimeout(timer);
    }, [navigation]);
    
    return (
        <View style={styles.container}>
            <Image 
                source={require('../../assets/splash.png')}
                style={styles.image}
            />
            <Text style={styles.mainText}>
                FOODIE
                <Text style={styles.highlightText}>HUB</Text>
            </Text>
            <Text style={styles.taglineText}>
                Delicious Moments Await
            </Text>
        </View>
    );
}

export default Splash;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    image: {
        width: width * 0.8,
        height: height * 0.4,
        resizeMode: 'contain',
        marginBottom: 30
    },
    mainText: {
        fontSize: 42,
        fontWeight: '800',
        letterSpacing: 2,
        textAlign: 'center',
        color: '#333',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3
    },
    highlightText: {
        color: '#FF6B6B',  // Coral color for 'HUB'
        fontWeight: '900'
    },
    taglineText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '500',
        letterSpacing: 1,
        marginTop: 5,
        fontStyle: 'italic'
    }
});
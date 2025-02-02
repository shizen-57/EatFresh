import React, { useState, useEffect } from 'react';
import {
     View,
     Text,
     StyleSheet,
     TextInput,
     TouchableOpacity,
     ScrollView,
     ActivityIndicator,
     Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';

const OwnerLogin = ({ navigation }) => {
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
         const checkUserLoggedIn = async () => {
             if (auth.currentUser) {
                 const userDocRef = doc(firestore, 'restaurant_owners', auth.currentUser.uid);
                 const userDoc = await getDoc(userDocRef);

                 if (userDoc.exists()) {
                     navigation.replace('AdminProfile');
                 }
             }
         };

         checkUserLoggedIn();
     }, [navigation]);

     const handleLogin = async () => {
         if (!email.trim() || !password.trim()) {
             Alert.alert('Error', 'Please enter both email and password');
             return;
         }

         setIsLoading(true);
         try {
             // Firebase Authentication
             const userCredential = await signInWithEmailAndPassword(auth, email, password);

             // Check if user is a restaurant owner
             const userDocRef = doc(firestore, 'restaurant_owners', userCredential.user.uid);
             const userDoc = await getDoc(userDocRef);

             if (userDoc.exists()) {
                 navigation.replace('AdminProfile');
             } else {
                 await signOut(auth);
                 Alert.alert('Error', 'You are not registered as a restaurant owner');
             }
         } catch (error) {
             let errorMessage = 'Login failed. Please try again.';

             if (error.code === 'auth/invalid-email') {
                 errorMessage = 'Invalid email address';
             } else if (error.code === 'auth/user-not-found') {
                 errorMessage = 'No user found with this email';
             } else if (error.code === 'auth/wrong-password') {
                 errorMessage = 'Incorrect password';
             }

             Alert.alert('Login Error', errorMessage);
         } finally {
             setIsLoading(false);
         }
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
                 <Icon name="restaurant" size={80} color="#4CAF50" />
                 <Text style={styles.title}>Restaurant Owner Login</Text>

                 <View style={styles.inputContainer}>
                     <Icon name="email" size={20} color="#666" style={styles.inputIcon} />
                     <TextInput
                         style={styles.input}
                         placeholder="Email"
                         value={email}
                         onChangeText={setEmail}
                         keyboardType="email-address"
                         autoCapitalize="none"
                         editable={!isLoading}
                     />
                 </View>

                 <View style={styles.inputContainer}>
                     <Icon name="lock" size={20} color="#666" style={styles.inputIcon} />
                     <TextInput
                         style={styles.input}
                         placeholder="Password"
                         value={password}
                         onChangeText={setPassword}
                         secureTextEntry
                         editable={!isLoading}
                     />
                 </View>

                 <TouchableOpacity
                     style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                     onPress={handleLogin}
                     disabled={isLoading}
                 >
                     {isLoading ? (
                         <ActivityIndicator color="#fff" />
                     ) : (
                         <Text style={styles.buttonText}>Login</Text>
                     )}
                 </TouchableOpacity>

                 <View style={styles.registerContainer}>
                     <Text style={styles.registerText}>Don't have an account? </Text>
                     <TouchableOpacity onPress={() => navigation.navigate('Requirements')}>
                         <Text style={styles.registerLink}>Register Now</Text>
                     </TouchableOpacity>
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
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 30,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        backgroundColor: '#f8f8f8',
        width: '100%',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        padding: 15,
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 20,
    },
    loginButtonDisabled: {
        backgroundColor: '#A5D6A7',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerContainer: {
        flexDirection: 'row',
        marginTop: 20,
    },
    registerText: {
        color: '#666',
        fontSize: 14,
    },
    registerLink: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default OwnerLogin;
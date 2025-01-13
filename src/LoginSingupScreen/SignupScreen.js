import React, { useState } from 'react';
import { Container, Input, Button, ButtonText } from './LoginSignupScreen.styled';
import { auth, db } from '../../firebase'; // Import Firebase auth and Firestore
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';

const SignupScreen = ({ navigation, route }) => {
    const { name, phone, location } = route.params;
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log('Signup successful:', user);

                // Store user info in Firestore
                await addDoc(collection(db, 'users'), {
                    uid: user.uid,
                    name,
                    phone,
                    location,
                    email,
                });

                navigation.navigate('HomeScreen');
            })
            .catch((error) => {
                console.error('Signup error:', error);
            });
    };

    return (
        <Container>
            <Input
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <Input
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button onPress={handleSignup}>
                <ButtonText>Sign Up</ButtonText>
            </Button>
        </Container>
    );
};

export default SignupScreen;
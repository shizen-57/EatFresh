import React, { useState } from 'react';
import { Container, Logo, Title, Input, Button, ButtonText, SignupText, SignupLink } from './LoginSignupScreen.styled';
import { auth } from '../../firebase'; // Import Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                console.log('Login successful:', userCredential.user);
                navigation.navigate('HomeScreen');
            })
            .catch((error) => {
                console.error('Login error:', error);
            });
    };

    const handleSignup = () => {
        navigation.navigate('SignupNext');  // Match the name in Stack.Screen
    };

    return (
        <Container>
            <Logo source={require('../../assets/logo.png')} />
            <Title>Login</Title>
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
            <Button onPress={handleLogin}>
                <ButtonText>Login</ButtonText>
            </Button>
            <SignupText>
                Don't have an account? <SignupLink onPress={handleSignup}>Sign Up</SignupLink>
            </SignupText>
        </Container>
    );
};

export default LoginScreen;
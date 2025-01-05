import React, { useState } from 'react';
import { Container, Logo, Title, Input, Button, ButtonText, SignupText, SignupLink } from './LoginSignupScreen.styled';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        // Handle login logic here
        console.log('Login with:', email, password);
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
                Don't have an account?{' '}
                <SignupLink onPress={handleSignup}>
                    Sign up
                </SignupLink>
            </SignupText>
        </Container>
    );
};

export default LoginScreen;
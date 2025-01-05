import React, { useState } from 'react';
import {
    Button,
    ButtonText,
    Container,
    Input,
    Logo,
    SignupLink,
    SignupText,
    Title
} from './LoginSignupScreen.styled';

const SignupScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = () => {
        console.log('Username:', username);
        console.log('Email:', email);
        console.log('Password:', password);
    };

    return (
        <Container>
            <Logo source={require('../../assets/SignUp.png')} />
            <Title>Create Account</Title>
            <Input
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
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
            <SignupText>
                Already have an account?{' '}
                <SignupLink onPress={() => navigation.navigate('Login')}>
                    Login
                </SignupLink>
            </SignupText>
        </Container>
    );
};

export default SignupScreen;
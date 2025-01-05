import React, { useState } from 'react';
import { Button, ButtonText, Container, Input, Logo, Title } from './LoginSignupScreen.styled';

const SignupNextScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');

    const handleNext = () => {
        // if (!name || !phone || !location) {
        //     Alert.alert('Error', 'Please fill all fields');
        //     return;
        // }

        navigation.navigate('Signup', {
            name,
            phone,
            location
        });
    };

    return (
        <Container>
            <Logo source={require('../../assets/SignUp.png')} />
            <Title>Complete Your Profile</Title>
            <Input
                placeholder="Name"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
            />
            <Input
                placeholder="Phone Number"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <Input
                placeholder="Location"
                value={location}
                onChangeText={setLocation}
                autoCapitalize="none"
            />
            <Button onPress={handleNext}>
                <ButtonText>Next</ButtonText>
            </Button>
        </Container>
    );
};

export default SignupNextScreen;
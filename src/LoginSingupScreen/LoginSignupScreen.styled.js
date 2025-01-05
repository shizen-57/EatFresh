import styled from 'styled-components/native';
import { View, TextInput, Text } from 'react-native';
import { TouchableOpacity } from 'react-native';



export const Container = styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 20px;
`;

export const Logo = styled.Image`
    width: 150px;
    height: 150px;
    margin-bottom: 20px;
`;

export const Input = styled.TextInput`
    width: 300px;
    height: 50px;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
`;

export const Button = styled(TouchableOpacity)`
    width: 100px;
    height: 50px;
    margin: 10px 0;
    justify-content: center;
    align-items: center;
    background-color: #ff6347;
    border-radius: 25px;
    elevation: 3;
    shadow-color: #000;
    shadow-offset: 0px 2px;
    shadow-opacity: 0.25;
    shadow-radius: 3.84px;
`;

export const ButtonText = styled.Text`
    color: #fff;
    font-size: 18px;
    font-weight: bold;
`;

export const ErrorMessage = styled.Text`
    color: red;
    font-size: 14px;
    margin: 10px;
`;

export const Title = styled.Text`
    font-size: 24px;
    margin-bottom: 16px;
    text-align: center;
    color: #333;
`;

export const SignupText = styled.Text`
    color: #333;
    margin-top: 20px;
`;

export const SignupLink = styled.Text`
    color: #ff6347;
    font-weight: bold;
`;
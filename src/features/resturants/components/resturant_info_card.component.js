import React from "react";
import styled from "styled-components/native"
import { Text, StyleSheet } from "react-native";
import { Card } from "react-native-paper";

const Title = styled.Text`
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
`;

export const ResturantInfoCard = ({ resturant = {} }) => {
  const {
    name = "Some Restaurant",
    photos = [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836"
    ],
    address = "Some random address",
    isOpenNow = true,
    rating = 4,
    isClosedTemporarily = false,
  } = resturant;

  return (
    <Card elevation={5} style={styles.card}>
      <Card.Cover style={styles.cover} source={{ uri: photos[0] }} />
      <Title>{name}</Title>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 8,
  },
  cover: {
    padding: 15,
    backgroundColor: "white",
  }
});

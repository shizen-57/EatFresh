import React from "react";
import styled from "styled-components/native";
import { Card } from "react-native-paper";

const ResturantCard = styled(Card)`
  background-color: white; /* Correct CSS property name and syntax */
  margin: 16px;
  border-radius: 8px;
`;

const ResturantCardCover = styled(Card.Cover)`
  padding: 15px;
  background-color: white; /* Correct CSS property name and syntax */
`;

const Title = styled.Text`
  padding: 16px;
  font-size: 18px;
  font-weight: bold;
  color: black; /* Optional: Added color for better styling */
`;

export const ResturantInfoCard = ({ resturant = {} }) => {
  const {
    name = "Some Restaurant",
    photos = [
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    ],
    address = "Some random address",
    isOpenNow = true,
    rating = 4,
    isClosedTemporarily = false,
  } = resturant;

  return (
    <ResturantCard elevation={5}>
      <ResturantCardCover source={{ uri: photos[0] }} />
      <Title>{name}</Title>
    </ResturantCard>
  );
};

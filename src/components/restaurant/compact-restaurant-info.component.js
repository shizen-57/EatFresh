import React from "react";
import styled from "styled-components/native";
import { Platform } from "react-native";
import WebView from "react-native-webview";
import { Text } from "../typography/text.component";

// Styled components
const CompactImage = styled.Image`
  border-radius: 10px;
  width: 120px;
  height: 100px;
`;

const CompactWebview = styled(WebView)`
  border-radius: 10px;
  width: 120px;
  height: 100px;
`;

const Item = styled.View`
  padding: 10px;
  max-width: 120px;
  align-items: center;
`;

const isAndroid = Platform.OS === "android";

export const CompactRestaurantInfo = ({ restaurant }) => {
  // Fallback for missing photos
  const imageUrl = restaurant.photos?.[0] || "https://via.placeholder.com/120x100";

  // Use WebView for Android if required, otherwise use Image
  const Image = isAndroid ? CompactWebview : CompactImage;

  return (
    <Item>
      <Image source={{ uri: imageUrl }} />
      <Text center variant="caption" numberOfLines={3}>
        {restaurant.name || "Unknown Restaurant"}
      </Text>
    </Item>
  );
};

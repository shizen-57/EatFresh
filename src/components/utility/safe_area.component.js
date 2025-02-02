import { StatusBar, SafeAreaView, Platform } from "react-native";
import styled from "styled-components/native";

export const SafeArea = styled(SafeAreaView)`
  flex: 1;
  margin-top: ${Platform.OS === "android" ? StatusBar.currentHeight || 0 : 0}px;
`;

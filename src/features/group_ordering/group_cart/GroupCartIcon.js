import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useGroupOrder } from "../context/GroupOrderContext";

export default function GroupCartIcon({ navigation }) {
  const { groupCart } = useGroupOrder();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => navigation.navigate("GroupOrder")}
    >
      <View style={styles.button}>
        <FontAwesome5 name="users" size={20} color="white" />
        <Text style={styles.text}>Group Cart • {groupCart.length} items</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    alignSelf: "center",
    zIndex: 999,
  },
  button: {
    flexDirection: "row",
    backgroundColor: "black",
    padding: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    marginLeft: 10,
  },
});

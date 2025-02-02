import {
    Dimensions,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
    FlatList,
  } from "react-native";
  import React, { useRef, useState } from "react";
  import { Ionicons } from "@expo/vector-icons";
  import { useNavigation } from "@react-navigation/native";
  
  const { width } = Dimensions.get("window");
  const slides = [
    {
        id: "1",
        title: "Connecting Homemade Flavors with Hungry Homes",
        image: require("../../assets/splash.png"),
    },
    {
        id: "2",
        title: "From Kitchen to Doorstep - Lightning Fast Delivery",
        image: require("../../assets/splash.png"),
    },
    {
        id: "3",
        title: "Grow Your Culinary Passion with EatFresh",
        image: require("../../assets/splash.png"),
    },
];
  
  const Onboard = () => {
    const navigation = useNavigation();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef(null);
  
    const handleNext = () => {
      if (currentIndex < slides.length - 1) {
        flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
        setCurrentIndex(currentIndex + 1);
      } else {
        navigation.navigate("Home");
      }
    };
  
    const handleSkip = () => {
      navigation.navigate("Home");
    };
  
    const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });
  
    const onViewableItemsChanged = useRef(({ viewableItems }) => {
      if (viewableItems.length > 0) {
        setCurrentIndex(viewableItems[0].index);
      }
    }).current;
  
    const renderItem = ({ item }) => (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipText}>Skip</Text>
            <Ionicons name="arrow-forward" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Image source={item.image} style={styles.image} />
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.indicatorContainer}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.indicator,
                  currentIndex === i && styles.activeIndicator,
                ]}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>
              {currentIndex === slides.length - 1 ? "Get Started" : "Next"}
            </Text>
            <Ionicons 
              name="arrow-forward" 
              size={20} 
              color="white" 
              style={styles.nextButtonIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  
    return (
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfigRef.current}
        ref={flatListRef}
      />
    );
  };
  
  export default Onboard;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: width,
      justifyContent: "space-between",
      paddingHorizontal: 20,
      backgroundColor: "#FFFFFF",
      ...Platform.select({
        ios: {
          paddingTop: 60,
        },
        android: {
          paddingTop: 40,
        },
      }),
    },
    header: {
      alignItems: "flex-end",
      marginBottom: 10,
    },
    skipButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 15,
      backgroundColor: "#e0e0e0",
      borderRadius: 20,
    },
    skipText: {
      fontSize: 16,
      marginRight: 5,
      color: "black",
    },
    image: {
      width: "100%",
      height: "50%",
      resizeMode: "contain",
    },
    card: {
      flex: 1,
      justifyContent: "flex-start",
      alignItems: "center",
      paddingTop: 30,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      textAlign: "center",
      color: "#333",
      marginBottom: 20,
      paddingHorizontal: 20,
    },
    indicatorContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: "#e0e0e0",
      marginHorizontal: 4,
    },
    activeIndicator: {
      backgroundColor: "#007AFF",
    },
    nextButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#007AFF",
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 25,
      marginTop: 30,
    },
    nextButtonText: {
      color: "white",
      fontSize: 18,
      fontWeight: "600",
      marginRight: 8,
    },
    nextButtonIcon: {
      marginLeft: 5,
    },
  });
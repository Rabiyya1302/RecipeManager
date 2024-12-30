import React from "react";
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import {
  useFonts,
  Roboto_700Bold,
  Roboto_900Black,
} from "@expo-google-fonts/roboto";
import { ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Correct hook import
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types"; // Ensure this is correct

// Define the type for navigation prop
type WelcomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Welcome"
>;

const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");

const WelcomeScreen: React.FC = () => {
  // Load fonts using expo-font
  const [fontsLoaded] = useFonts({
    Roboto_700Bold,
    Roboto_900Black,
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Use typed navigation hook
  const navigation = useNavigation<WelcomeScreenNavigationProp>();

  return (
    <ImageBackground
      source={require("../../assets/images/ginger.jpg")} // Replace with your image
      style={styles.background}
    >
      <View style={styles.overlay}>
        {/* Title */}
        <Text style={styles.title}>Welcome To CookPad</Text>

        {/* Subtitle */}

        {/* Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("main")}
        >
          <Text style={styles.buttonText}>Add Recipe</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

// Styles for the screen
const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    justifyContent: "flex-end",
  },
  overlay: {
    paddingHorizontal: "5%", // Dynamic padding
    paddingBottom: "10%", // Ensure consistent spacing across screen sizes
    alignItems: "center",
  },
  title: {
    fontSize: viewportWidth * 0.08, // Dynamic font size based on screen width
    fontFamily: "Roboto_900Black",
    color: "#F8F122", // Bright yellow for the title
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: viewportWidth * 0.045, // Adjust subtitle font size dynamically
    fontFamily: "Roboto_700Bold",
    color: "#FFFFFF", // White subtitle text
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFA500", // Orange button
    paddingVertical: viewportWidth * 0.03, // Dynamic padding
    paddingHorizontal: viewportWidth * 0.15,
    borderRadius: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: viewportWidth * 0.045, // Dynamic font size
    fontWeight: "bold",
  },
});

export default WelcomeScreen;

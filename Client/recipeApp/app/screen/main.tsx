import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import axios from "axios"; // For HTTP requests

// Define the RootStackParamList for navigation and route types
type RootStackParamList = {
  main: { recipe?: Recipe };
  createRecipe: undefined;
  cookPad: undefined;
  myRecipe: undefined;
};

type MainScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "main">;
type MainScreenRouteProp = RouteProp<RootStackParamList, "main">;

// Recipe interface
interface Recipe {
  title: string;
  description: string;
  image: string;
}

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const MainScreen: React.FC = () => {
  const navigation = useNavigation<MainScreenNavigationProp>();
  const route = useRoute<MainScreenRouteProp>();
  const [menuVisible, setMenuVisible] = useState(false);
  const [recipes, setRecipes] = useState<Recipe[]>([]); // Array of recipes
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const slideAnim = useRef(new Animated.Value(-viewportWidth * 0.6)).current;

  const newRecipe = route.params?.recipe; // Retrieve the new recipe from route params

  // Update the recipes list when a new recipe is added
  React.useEffect(() => {
    if (newRecipe) {
      setRecipes((prevRecipes) => [...prevRecipes, newRecipe]);
    }
  }, [newRecipe]);

  // Fetch recipes when the component mounts
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://192.168.43.44:3000/api/recipe"); // Replace with your backend URL
        setRecipes(response.data);
      } catch (err) {
        setError("Error fetching recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleMenuToggle = () => {
    setMenuVisible(!menuVisible);
    Animated.timing(slideAnim, {
      toValue: menuVisible ? -viewportWidth * 0.6 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderRecipeCard = ({ item }: { item: Recipe }) => {
    // Base64 image handling (assuming the image is Base64 encoded)
    const imageUri = item.image ? `data:image/jpeg;base64,${item.image}` : null;

    return (
      <View style={styles.card}>
        {imageUri && <Image source={{ uri: imageUri }} style={styles.cardImage} />}
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>
      </View>
    );
  };

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleMenuToggle} style={styles.menuIcon}>
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.logo}>cookPad</Text>
      </View>

      {/* Drawer Menu */}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.navigate("myRecipe")}>
          <Text style={styles.menuItem}>Your Recipes</Text>
        </TouchableOpacity>
        
      </Animated.View>

      {/* Main Content - FlatList for Recipe Cards (with scrolling) */}
      <ImageBackground
        source={require("../../assets/images/GHJ.jpg")}
        style={styles.backgroundImage}
        imageStyle={styles.imageStyle}
      >
        {recipes.length === 0 ? (
          <View style={styles.overlay}>
            <Text style={styles.overlayText}>NO RECIPES YET</Text>
          </View>
        ) : (
          <FlatList
            data={recipes}
            renderItem={renderRecipeCard}
            keyExtractor={(_item, index) => index.toString()}
            contentContainerStyle={styles.recipeList}
            style={styles.flatList} // Add this style for FlatList scrollable space
          />
        )}
      </ImageBackground>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate("createRecipe")}
      >
        <MaterialIcons name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    backgroundColor: "#FFA500",
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 2,
  },
  menuIcon: { position: "absolute", left: 20 },
  logo: { color: "#fff", fontSize: 22, fontWeight: "bold" },
  drawer: {
    position: "absolute",
    left: 0,
    top: 60,
    width: "60%",
    height: "100%",
    backgroundColor: "rgba(228, 154, 18, 0.71)",
    paddingVertical: 20,
    paddingLeft: 20,
    zIndex: 1,
  },
  menuItem: { color: "#fff", fontSize: 18, marginBottom: 20 },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  imageStyle: { width: viewportWidth, height: viewportHeight, resizeMode: "cover" },
  overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)", padding: 20, borderRadius: 10 },
  overlayText: { color: "#fff", fontSize: 22, fontWeight: "bold", textAlign: "center" },
  fab: {
    backgroundColor: "#FFA500",
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  recipeList: { padding: 20 },
  flatList: { flex: 1 }, // Ensure FlatList takes up full height
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    width: viewportWidth * 0.9, // Responsive width (90% of screen width)
    maxWidth: 400, // Max width to prevent large cards on wide screens
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
    marginHorizontal: "5%", // Center the card horizontally
  },
  cardImage: {
    width: "100%",
    height: 200, // Fixed height for the image
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 10,
  },
  cardDescription: {
    fontSize: 14,
    color: "#555",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  loadingText: { fontSize: 18, textAlign: "center", marginTop: 20 },
  errorText: { fontSize: 18, color: "red", textAlign: "center", marginTop: 20 },
});

export default MainScreen;

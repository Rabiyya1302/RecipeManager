import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RecipeScreenProp = NativeStackNavigationProp<RootStackParamList, "myRecipe">;

const RecipeScreen: React.FC = () => {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]);
  const [favourites, setFavourites] = useState<string[]>([]); // Track favourites
  const navigation = useNavigation<RecipeScreenProp>();

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get("http://192.168.43.44:3000/api/recipe");
        setRecipes(response.data);
        setFilteredRecipes(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipes:", error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  const handleEdit = (recipe: any) => {
    navigation.navigate("createRecipe", { recipe });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query === "") {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter((recipe) =>
        recipe.title.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRecipes(filtered);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://192.168.43.44:3000/api/recipe/${id}`);
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== id)
      );
      setFilteredRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe._id !== id)
      );
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  const handleToggleFavourite = (id: string) => {
    if (favourites.includes(id)) {
      setFavourites(favourites.filter(favId => favId !== id)); // Remove from favourites
    } else {
      setFavourites([...favourites, id]); // Add to favourites
    }
  };

  const renderRecipeCard = ({ item }: { item: any }) => {
    const imageUri = item.image && item.image[0]
      ? `data:image/jpeg;base64,${item.image[0]}`
      : null;

    const isFavourite = favourites.includes(item._id); // Check if recipe is favourite

    return (
      <View style={styles.card}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.cardImage} />
        )}
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDescription}>{item.description}</Text>

        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleEdit(item)}
          style={styles.editButton}
        >
          <Ionicons name="pencil" size={24} color="blue" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleToggleFavourite(item._id)}
          style={styles.favouriteButton}
        >
          <Ionicons
            name={isFavourite ? "star" : "star-outline"}
            size={24}
            color={isFavourite ? "gold" : "gray"} // Change color based on favourite status
          />
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>CookPad</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        value={searchQuery}
        onChangeText={handleSearch}
        placeholder="Search Recipes"
        style={styles.searchBar}
      />

      {/* Recipe List */}
      <FlatList
        data={filteredRecipes}
        renderItem={renderRecipeCard}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.recipeList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF3E3",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: "#FFA500",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    zIndex: 2,
    elevation: 3, // for Android shadow
  },
  headerTitle: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold",
  },
  backButton: {
    position: "absolute",
    left: 10,
  },
  searchBar: {
    height: 45,
    borderColor: "#E2C897",
    borderWidth: 1,
    borderRadius: 25,
    marginTop: 80, // Adjusted for header height
    marginBottom: 15,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    backgroundColor: "#FFF",
    fontSize: 16,
    color: "#555",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  recipeList: {
    paddingBottom: 20,
    paddingTop: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    marginBottom: 20,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 180,
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 10,
    marginHorizontal: 15,
  },
  cardDescription: {
    fontSize: 14,
    color: "#777",
    marginHorizontal: 15,
    marginVertical: 10,
    lineHeight: 20,
  },
  deleteButton: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#FFD1D1",
    borderRadius: 15,
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    position: "absolute",
    top: 15,
    right: 50,
    backgroundColor: "#D1E7FF",
    borderRadius: 15,
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  favouriteButton: {
    position: "absolute",
    top: 15,
    right: 85,
    backgroundColor: "#FFF7D1",
    borderRadius: 15,
    padding: 7,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default RecipeScreen;

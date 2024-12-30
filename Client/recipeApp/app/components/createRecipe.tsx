import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types"; // Ensure this is correct
import { useRoute, RouteProp } from "@react-navigation/native";

// Define the type for navigation prop
type CreateScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "createRecipe"
>;

// Define the type for route params
type CreateScreenRouteProp = RouteProp<RootStackParamList, "createRecipe">;

const CreateScreen = () => {
  const navigation = useNavigation<CreateScreenNavigationProp>();
  const route = useRoute<CreateScreenRouteProp>();

  // Check if we're editing an existing recipe
  const { recipe } = route.params || {};

  const [recipeTitle, setRecipeTitle] = useState(recipe?.title || "");
  const [ingredients, setIngredients] = useState(recipe?.ingredients || "");
  const [steps, setSteps] = useState(recipe?.steps || "");
  const [image, setImage] = useState<string | null>(recipe?.image || null);
  const [errors, setErrors] = useState({
    recipeTitle: "",
    ingredients: "",
    steps: "",
    image: "",
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const getBlob = async (uri: string) => {
    const response = await fetch(uri);
    return await response.blob();
  };

  const handleSubmit = async () => {
    const validationErrors = { recipeTitle: "", ingredients: "", steps: "", image: "" };

    if (!recipeTitle) validationErrors.recipeTitle = "Recipe title is required.";
    if (!ingredients) validationErrors.ingredients = "Ingredients are required.";
    if (!steps) validationErrors.steps = "Steps are required.";
    if (!image) validationErrors.image = "Image is required.";

    setErrors(validationErrors);

    if (Object.values(validationErrors).some((error) => error)) return;

    const formData = new FormData();
    formData.append("recipeTitle", recipeTitle);
    formData.append("ingredients", ingredients);
    formData.append("steps", steps);

    const imageBlob = await getBlob(image!);
    formData.append("image", imageBlob, "recipe-image.jpg");

    try {
      let response;
      if (recipe) {
        // Update existing recipe
        response = await fetch(`http://192.168.43.44:3000/api/recipe/${recipe._id}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        // Create new recipe
        response = await fetch("http://192.168.43.44:3000/api/recipe", {
          method: "POST",
          body: formData,
        });
      }

      if (response.ok) {
        Alert.alert(
          "Success",
          recipe ? "Recipe updated successfully!" : "Recipe added successfully!"
        );
        navigation.goBack();
      } else {
        const error = await response.json();
        Alert.alert("Error", error.message || "Failed to save recipe.");
      }
    } catch (error) {
      Alert.alert("Error", "Network error occurred.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {recipe ? "Edit Recipe" : "Add Recipe"}
        </Text>
      </View>

      <Text style={styles.label}>Recipe Title</Text>
      <TextInput
        style={[styles.input, errors.recipeTitle && { borderColor: "red" }]}
        placeholder="Enter the recipe title"
        value={recipeTitle}
        onChangeText={(text) => {
          setRecipeTitle(text);
          setErrors((prev) => ({ ...prev, recipeTitle: "" }));
        }}
      />
      {errors.recipeTitle && <Text style={styles.errorText}>{errors.recipeTitle}</Text>}

      <Text style={styles.label}>Ingredients</Text>
      <TextInput
        style={[styles.textArea, errors.ingredients && { borderColor: "red" }]}
        placeholder="List ingredients separated by commas"
        value={ingredients}
        onChangeText={(text) => {
          setIngredients(text);
          setErrors((prev) => ({ ...prev, ingredients: "" }));
        }}
        multiline
        numberOfLines={4}
      />
      {errors.ingredients && <Text style={styles.errorText}>{errors.ingredients}</Text>}

      <Text style={styles.label}>Preparation Steps</Text>
      <TextInput
        style={[styles.textArea, errors.steps && { borderColor: "red" }]}
        placeholder="Describe the preparation steps"
        value={steps}
        onChangeText={(text) => {
          setSteps(text);
          setErrors((prev) => ({ ...prev, steps: "" }));
        }}
        multiline
        numberOfLines={6}
      />
      {errors.steps && <Text style={styles.errorText}>{errors.steps}</Text>}

      <Text style={styles.label}>Recipe Image</Text>
      <TouchableOpacity
        style={[styles.imagePicker, errors.image && { borderColor: "red" }]}
        onPress={pickImage}
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.recipeImage} />
        ) : (
          <Ionicons name="camera" size={32} color="#999" />
        )}
      </TouchableOpacity>
      {errors.image && <Text style={styles.errorText}>{errors.image}</Text>}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>
          {recipe ? "Update Recipe" : "Submit Recipe"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF3E3", padding: 16 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  backButton: { marginRight: 10 },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFA500",
  },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    backgroundColor: "#fff",
    fontSize: 16,
    textAlignVertical: "top",
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    marginTop: 10,
    marginBottom: 20,
  },
  recipeImage: { width: "100%", height: "100%", borderRadius: 8 },
  submitButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  submitButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  errorText: { color: "red", fontSize: 14, marginTop: 4 },
});

export default CreateScreen;

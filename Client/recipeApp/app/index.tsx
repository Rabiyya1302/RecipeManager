import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
// Adjust the path to your FavoriteContext file
import HomeScreen from "./screen/Home";
import WelcomeScreen from "./screen/Welcome";
import MainScreen from "./screen/main";
import CreateScreen from "./components/createRecipe";
import CookPadScreen from "./screen/cookPad";
import RecipeScreen from "./screen/myRecipe";

const Stack = createStackNavigator();

const App = () => (
  
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide headers in the stack screens
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="createRecipe" component={CreateScreen} />
        <Stack.Screen name="main" component={MainScreen} />
      
        <Stack.Screen name="cookPad" component={CookPadScreen} />
        <Stack.Screen name="myRecipe" component={RecipeScreen} />
        
      </Stack.Navigator>

);

export default App;

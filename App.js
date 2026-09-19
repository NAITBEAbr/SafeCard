import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import CardDetail from "./screens/CardDetail";
import BottomTabNavigator from "./components/BottomTabNavigator";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
        <Stack.Screen name="CardDetail" component={CardDetail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

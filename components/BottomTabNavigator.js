import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import CardList from "../screens/CardList";
import AddCard from "../screens/AddCard";

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#5653D4",
        tabBarInactiveTintColor: "#9C9C9C",
        tabBarStyle: { height: 70, paddingBottom: 10, paddingTop: 6 },
        tabBarLabelStyle: { fontSize: 14 },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            "Meus cartões": "card",
            Adicionar: "add-circle",
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
      })}
    >
      <Tab.Screen name="Meus cartões" component={CardList} />
      <Tab.Screen name="Adicionar" component={AddCard} />
    </Tab.Navigator>
  );
}

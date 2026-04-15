import React from 'react';
import { StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
//icons
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MinecraftItems from "./Minecraft/MinecraftItems";
import MinecraftRender from "./Minecraft/MinecraftRender";
import MinecraftInventory from "./Minecraft/MinecraftInventory";
import ItemDetailsScreen from "./Minecraft/ItemDetailsScreen";
import RenderDetailScreen from "./Minecraft/RenderDetailScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const stackScreenOptions = {
  headerStyle: {
    backgroundColor: '#8B4513',
    borderBottomWidth: 4,
    borderBottomColor: '#5C2E0D',
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: '900',
    letterSpacing: 1,
  },
  headerTitleAlign: 'center',
};

function ItemsStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen 
        name="ItemsList" 
        component={MinecraftItems}
        options={{
          title: "Items",
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="ItemDetails" 
        component={ItemDetailsScreen}
        options={{
          title: "Detalles del Item",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

function RenderStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen 
        name="RenderList" 
        component={MinecraftRender}
        options={{
          title: "Render",
          headerShown: true,
        }}
      />
      <Stack.Screen 
        name="RenderDetail" 
        component={RenderDetailScreen}
        options={{
          title: "Visualización 3D",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

function InventoryStack() {
  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      <Stack.Screen 
        name="InventoryList" 
        component={MinecraftInventory}
        options={{
          title: "Inventario",
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function Navigations() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#111111',
        tabBarInactiveTintColor: '#111111',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: styles.tabBarItem,
        tabBarIconStyle: styles.tabBarIcon,
        headerStyle: {
          backgroundColor: '#8B4513',
        },
      }}
    >
        <Tab.Screen
        name='MinecraftItems'
        component={ItemsStack}
        options={{
          title: "Items",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="minecraft" size={size} color={color} />
          ),
        }}
        />
        
        <Tab.Screen
        name='MinecraftRender'
        component={RenderStack}
        options={{
          title: "Render",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cube-outline" size={size} color={color} />
          ),
        }}
        />
        
        <Tab.Screen
        name='MinecraftInventory'
        component={InventoryStack}
        options={{
          title: "Inventario",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="treasure-chest" size={size} color={color} />
          ),
        }}
        />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#2d6e1f',
    borderTopWidth: 4,
    borderTopColor: '#1a4412',
    height: 96,
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 12,
  },
  tabBarItem: {
    marginHorizontal: 8,
    borderWidth: 4,
    borderColor: '#111111',
    borderRadius: 0,
    backgroundColor: '#4caf50',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  tabBarIcon: {
    marginTop: 6,
  },
});
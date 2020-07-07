/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import { createAppContainer } from 'react-navigation';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginPage from 'components/LoginPage';
import AddLocationPage from 'components/AddLocationPage';
import LocationList from 'components/LocationList';
import About from 'components/About';
import AddLocationModal from 'components/AddLocationModal';
import FlyToLocation from 'components/FlyToLocation';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Text, Button } from 'react-native';

const AddLocationStack = createStackNavigator();
function AddLocationStackScreen() {
  return <Stack.Navigator>
    <Stack.Screen
      name="AddLocation"
      component={AddLocationPage}
      options={{ title: 'Add Location' }}
    />
  </Stack.Navigator>
}

const LocationListStack = createStackNavigator();

function LocationListStackScreen() {
  return <LocationListStack.Navigator>
    <LocationListStack.Screen
      name="LocationList"
      component={LocationList}
      options={{ title: 'Locations' }}
    />
    <LocationListStack.Screen
      name="FlyToLocation"
      component={FlyToLocation}
      options={{ title: 'Back' }}
    />
  </LocationListStack.Navigator>
}

const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AddLocationStackScreen"
        component={AddLocationStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcon name="add-location" color={color} size={size} />
          ),
          tabBarLabel: 'Add Location'
        }} />
      <Tab.Screen
        name="LocationListStackScreen"
        component={LocationListStackScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={size} />
          ),
          tabBarLabel: 'View Locations'
        }} />
      <Tab.Screen
        name="About"
        component={About}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="info-circle" color={color} size={size} />
          ),
          tabBarLabel: 'About'
        }} />
    </Tab.Navigator>
  );
}


const Stack = createStackNavigator();

function MainStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginPage"
        component={LoginPage}
        options={{ title: 'Login' }}
      />
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabs}
        options={{ title: 'Map Application', headerShown: false }}
      />
    </Stack.Navigator>
  )
}

const RootStack = createStackNavigator();
export default function RootStackScreen() {
  return (
    <NavigationContainer>
      <RootStack.Navigator mode="modal">
        <RootStack.Screen
          name="MainStackScreen"
          component={MainStackScreen}
          options={{ headerShown: false }}
        />
        <RootStack.Screen name="AddLocationModal" component={AddLocationModal}
          options={{ title: "Enter Location Detail" }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
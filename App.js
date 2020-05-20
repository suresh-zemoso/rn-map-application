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
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { Text, Button } from 'react-native';


const Tab = createBottomTabNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="AddLocationPage"
        component={AddLocationPage}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcon name="add-location" color={color} size={size} />
          ),
        }} />
      <Tab.Screen
        name="LocationList"
        component={LocationList}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="list" color={color} size={size} />
          )
        }} />
      <Tab.Screen
        name="About"
        component={About}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="info-circle" color={color} size={size} />
          )
        }} />
    </Tab.Navigator>
  );
}


const Stack = createStackNavigator();

function MainStackScreen() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
          name="Home"
          component={LoginPage}
          options={{ title: 'Login' }}
        /> */}
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
        // options={{ headerShown: false }}
        />
        <RootStack.Screen name="AddLocationModal" component={AddLocationModal} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
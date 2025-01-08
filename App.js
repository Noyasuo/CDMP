import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, View, Text, StyleSheet } from 'react-native';

// Import screens
import GetStartedScreen from './screens/GetStartedScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ShopScreen from './screens/ShopScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import ProductScreen from './screens/ProductScreen'; // Import ProductScreen
import { CartProvider } from './screens/CartContext';
import ForgotPassword from './screens/ForgotPaasword';
import History from './screens/History';

// Custom header component
const Header = () => (
  <View style={styles.headerContainer}>
    <Image
      source={require('./assets/logo.jpg')}
      style={styles.headerImage} // Circular image with borderRadius
    />
    <Text style={styles.headerText}>Colegio de Montalban</Text>
  </View>
);

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// Bottom Tab Navigator containing Home, Shop, Order, and Profile screens
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Shop') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Order') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#004d00',
        },
        headerStyle: {
          backgroundColor: '#004d00',
        },
        headerTitle: () => <Header />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Shop" component={ShopScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator containing GetStarted, Login, CreateAccount, Product, and MainTabNavigator
export default function App() {
  return (
    <NavigationContainer>
      <CartProvider>
      <Stack.Navigator initialRouteName="GetStarted">
        <Stack.Screen
          name="GetStarted"
          component={GetStartedScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateAccount"
          component={CreateAccountScreen}
          options={{ title: 'Create Account', headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={{ title: 'Product Details' }}
        />
        <Stack.Screen
        name="forgot"
        component={ForgotPassword}
        options={{ title: 'Forgot Password' }}
        />
        <Stack.Screen
        name="History"
        component={History}
        />
      </Stack.Navigator>
      </CartProvider>
    </NavigationContainer>
  );
}

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { View, Text } from "react-native";
import * as SecureStore from "expo-secure-store";

import Main from "./screens/Main";
import SignIn from "./screens/SignIn";
import Credit from "./screens/Credit";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const signOut = async () => {
    await SecureStore.deleteItemAsync("token");
    props.navigation.reset({
      index: 0,
      routes: [{ name: "SignIn" }],
    });
  };

  return (
    <View style={{ paddingTop: 50 }}>
      <DrawerItem label="Main" onPress={() => props.navigation.navigate("Main")} />
      <DrawerItem label="Credit" onPress={() => props.navigation.navigate("Credit")} />
      <DrawerItem label="Sign Out" onPress={signOut} labelStyle={{ color: 'red' }} />
    </View>
  );
};

function MainDrawer() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />} >
      <Drawer.Screen name="Main" component={Main} />
      <Drawer.Screen name="Credit" component={Credit} />
    </Drawer.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
        <Stack.Screen name="MainDrawer" component={MainDrawer} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
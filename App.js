import Login from "./Login";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Home from "./Home";

const Stack = createNativeStackNavigator()

export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false}}>
                <Stack.Screen
                    name={"Home"}
                    component={Home}
                />
                <Stack.Screen
                    name={"Login"}
                    component={Login}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
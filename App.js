import Login from "./Login";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import Noten from "./Noten";
import Account from "./Account"
import Kalender from "./Kalender"

const Stack = createNativeStackNavigator()

export default function App() {

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{headerShown: false, animation: "fade"}}>
                <Stack.Screen
                    name={"Noten"}
                    component={Noten}
                />
                <Stack.Screen
                    name={"Login"}
                    component={Login}
                />
                <Stack.Screen
                    name={"Kalender"}
                    component={Kalender}
                />
                <Stack.Screen
                    name={"Account"}
                    component={Account}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text, TouchableOpacity
} from 'react-native';
import {StatusBar} from "expo-status-bar";
import Navbar from "./Navbar";
import {deleteLoginData, getLoginData} from "./Files";
import {registerForPushNotificationsAsync, removeNotificationToken} from "./Server";

export default function Home({navigation}){

    const[notificationToken, setNotificationToken] = useState("")

    const[enummer, setEnummer] = useState("none")

    useEffect(() => {
        const load = async () => {
            setEnummer((await getLoginData()).enummer)
            await registerForPushNotificationsAsync().then(token => {
                setNotificationToken(token);
            });
        }
        load().catch(() => console.log(error))
    }, []);

    const logOut = async () => {
        const e = (await getLoginData()).enummer;
        await removeNotificationToken(e, notificationToken).catch(error => console.log(error))
        deleteLoginData().catch(error => console.log(error))
        navigation.navigate("Login")
    }

    return (
        <View style={{backgroundColor: "white", flex: 1, padding: 15, paddingBottom: 0}}>
            <View style={styles.container}>
                <Image source={require("./assets/profile.png")} style={styles.accountIcon}></Image>
                <Text style={styles.nummerText}>{enummer}</Text>
                <TouchableOpacity style={styles.logoutButton} onPress={logOut}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
                <StatusBar style={"light"} translucent={true} hidden={false}/>
            </View>
            <Navbar navigation={navigation}></Navbar>
        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    },
    accountIcon: {
        height: "20%",
        resizeMode: "contain",
    },
    logoutButton: {
        flex: 1,
        backgroundColor: "#429cf5",
        width: "80%",
        maxHeight: "10%",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    logoutText: {
        color: "white",
        fontSize: 30
    },
    nummerText: {
        fontSize: 30,
        padding: 15
    }
});

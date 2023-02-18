import {Image, Text, TouchableOpacity, View, StyleSheet} from "react-native";
import React from "react";

export default function Navbar({navigation}){
    return <View style={{justifyContent: "flex-end", alignItems: "center", paddingTop: 10, height: "13%"}}>
        <View style={styles.navbarContainer}>
            <TouchableOpacity style={styles.navbarButtons} onPress={() => {navigation.navigate("Home")}}>
                <Image source={require("./assets/marks.png")} style={styles.navbarIcon}></Image>
                <Text style={styles.navbarText}>Noten</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navbarButtons} onPress={() => {navigation.navigate("Account")}}>
                <Image source={require("./assets/profile-blue.png")} style={styles.navbarIcon}></Image>
                <Text style={styles.navbarText}>Account</Text>
            </TouchableOpacity>
        </View>
    </View>
}

const styles = StyleSheet.create({
    navbarContainer: {
        height: "100%",
        width: "100%",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 1,
        shadowRadius: 16.00,
        elevation: 24,
        alignItems: "center",
        justifyContent: "space-evenly",
        flexDirection: "row",
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderWidth: 1,
        borderColor: "#696969"
    },
    navbarIcon: {
        height: 40,
        width: 40,
        color: "orange"
    },
    navbarButtons: {
        justifyContent: "center",
        alignItems: "center"
    },
    navbarText: {
        color: "#429cf5",
    }
})
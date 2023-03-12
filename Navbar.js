import {Image, Text, View, StyleSheet} from "react-native";
import React from "react";
import {TouchableRipple} from "react-native-paper";

export default function Navbar({navigation, screen}){
    return <View style={{justifyContent: "flex-end", alignItems: "center", paddingTop: 10, height: "13%"}}>
        <View style={styles.navbarContainer}>
            <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"} style={[styles.navbarButtons,  {width: "20%"}]} onPress={() => {navigation.navigate("Noten")}}>
                <View style={{justifyContent: "center", alignItems: "center", width: "100%", padding: 5, borderRadius: 5, backgroundColor: screen !== "Noten" ? "white" : "rgba(66,156,245,0.44)"}}>
                    <Image source={require("./assets/marks.png")} style={styles.navbarIcon}></Image>
                    <Text style={styles.navbarText}>Noten</Text>
                </View>
            </TouchableRipple>
            <TouchableRipple rippleColor={"rgba(255,255,255,0.9)"} style={[styles.navbarButtons,  {width: "20%"}]} onPress={() => {navigation.navigate("Kalender")}}>
                <View style={{justifyContent: "center", alignItems: "center", width: "100%", padding: 5, borderRadius: 5, backgroundColor: screen !== "Kalender" ? "white" : "rgba(66,156,245,0.44)"}}>
                    <Image source={require("./assets/kalender.png")} style={styles.navbarIcon}></Image>
                    <Text style={styles.navbarText}>Kalender</Text>
                </View>
            </TouchableRipple>
            <TouchableRipple rippleColor={"rgba(255,255,255,0.9)"} style={[styles.navbarButtons,  {width: "20%"}]} onPress={() => {navigation.navigate("Account")}}>
                <View style={{justifyContent: "center", alignItems: "center", width: "100%", padding: 5, borderRadius: 5, backgroundColor: screen !== "Account" ? "white" : "rgba(66,156,245,0.44)"}}>
                    <Image source={require("./assets/profile.png")} style={styles.navbarIcon}></Image>
                    <Text style={styles.navbarText}>Account</Text>
                </View>
            </TouchableRipple>
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
        color: "black",
    }
})
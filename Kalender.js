import React from 'react';
import {
    StyleSheet,
    View,
} from 'react-native';
import Navbar from "./Navbar";


export default function Account({navigation}){

    return (
        <View style={{backgroundColor: "white", flex: 1, padding: 15, paddingBottom: 0}}>
            <Navbar navigation={navigation} screen={"Kalender"}></Navbar>
        </View>

    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        alignItems: "center",
        justifyContent: "center"
    }
});

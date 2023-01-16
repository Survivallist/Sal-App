import React, { useState } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import {SelectList} from "react-native-dropdown-select-list";

import axios from "axios";

export default function Login(){

    async function isUser(e, password)
    {
        let result;

        console.log(e);

        await axios.post("https://salmobile-production.up.railway.app/isUser",{
            e: e,
            password: password
        }).then(response => {
            result = response.data
            console.log(response.data);
        })
            .catch(error => console.log(error))
        return result;
    }
    const onPressLogin = async () => {
        if(! await isUser(state.e, state.password))
        {
            setState({error: "Cant find account"});
        }
        else
        {
            setState({error: "juhu"});
        }
    };
    const [state, setState] = useState({
        e: '',
        password: '',
        error: "",
        selected: ""
    });
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.error}>{state.error}</Text>
            <View style={{paddingBottom: 20}}>
                <SelectList data={
                    [
                        {key: "sekae", value: "Sekundarschule Aesch"},
                        {key: "sekal", value: "Sekundarschule Allschwil"},
                        {key: "sekam", value: "Sekundarschule Arlesheim-Münchenstein"},
                        {key: "sekbi", value: "Sekundarschule Binningen"},
                        {key: "sekbf", value: "Sekundarschule Birsfelden"},
                        {key: "sekgk", value: "Sekundarschule Gelterkinden"},
                        {key: "seklt", value: "Sekundarschule Laufental"},
                        {key: "sekli", value: "Sekundarschule Liestal"},
                        {key: "sekmu", value: "Sekundarschule Muttenz"},
                        {key: "sekow", value: "Sekundarschule Oberwil"},
                        {key: "sekrw", value: "Sekundarschule Reigoldswil"},
                        {key: "sekre", value: "Sekundarschule Reinach"},
                        {key: "seksi", value: "Sekundarschule Sissach"},
                        {key: "sektw", value: "Sekundarschule Therwil"},
                        {key: "sekwt", value: "Sekundarschule Waldenburgertal"},
                    ]
                } setSelected={select => setState({selected: select})}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    //secureTextEntry
                    placeholder="SAL-Passwort"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => {
                        setState({e: text});
                    }}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    //secureTextEntry
                    placeholder="SAL-Passwort"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => {
                        setState({password: text});
                    }}/>
            </View>
            <TouchableOpacity
                onPress = {onPressLogin}
                style={styles.loginBtn}>
                <Text style={styles.loginText}>LOGIN</Text>
            </TouchableOpacity>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title:{
        fontWeight: "bold",
        fontSize:30,
        color:"#545454",
        marginBottom: 40,
    },
    error:{
        fontSize:20,
        color:"#f55442",
    },
    inputView:{
        width:"80%",
        borderRadius: 25,
        borderWidth: 1,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20,
        borderColor: "black"
    },
    inputText:{
        height:50,
    },
    loginText:{
        color:"545454",

    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#3897f5",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
    },
});
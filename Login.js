import React, { useState } from 'react';
import {StyleSheet, Text, View, TextInput, TouchableOpacity, TextInputComponent} from 'react-native';
import {SelectList} from "react-native-dropdown-select-list";

import axios from "axios";
import AndroidSafeView from "./AndroidSafeView";

export default function Login(){

    async function isUser(enummer, password, school)
    {
        let result;

        console.log(enummer + " " + password + " " + school);

        await axios.post("https://salmobile-production.up.railway.app/isUser",{
            e: enummer,
            password: password,
            school: school
        }).then(response => {
            result = response.data
            console.log(response.data);
        })
            .catch(error => console.log(error))
        return result;
    }
    const onPressLogin = async () => {
        if(! await isUser(state.enummer, state.password, state.school))
        {
            setState({error: "Cant find account"});
        }
        else
        {
            setState({error: "juhu"});
        }
    };
    const [state, setState] = useState({
        enummer: "",
        password: "",
        error: "",
        school: "sekow"
    });
    return (
        <View style={[AndroidSafeView.AndroidSafeArea, styles.container]}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.error}>{state.error}</Text>
            <View style={{paddingBottom: 20, justifyContent: "center", alignItems: "center", width: "80%"}}>
                <SelectList
                    data={
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
                    }
                    setSelected={selected => setState({enummer: state.enummer, password: state.password, error: state.error, school: selected})}
                    boxStyles={{borderRadius: 25, width: "100%",  borderColor: "black", justifyContent: "space-evenly",
                        height: 50, alignItems: "center"}}
                    placeholder={"Wähle deine Schule aus"}
                    search={false}
                    dropdownStyles={{borderRadius: 25, borderColor: "black"}}
                    dropdownTextStyles={{fontSize: 13}}
                    inputStyles={{fontSize: 13}}

                />
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    //secureTextEntry
                    placeholder="SAL-Passwort"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => {
                        setState({enummer: text, password: state.password, error: state.error, school: state.school});
                    }}/>
            </View>
            <View style={styles.inputView}>
                <TextInput
                    style={styles.inputText}
                    //secureTextEntry
                    placeholder="SAL-Passwort"
                    placeholderTextColor="#003f5c"
                    onChangeText={text => {
                        setState({enummer: state.enummer, password: text, error: state.error, school: state.school});
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
        marginBottom: 10,
    },
    error:{
        fontSize:15,
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
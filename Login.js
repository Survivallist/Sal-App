import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import {SelectList} from "react-native-dropdown-select-list";
import {isKnown} from "./Server";
import {setLoginData} from "./Files";

export default function Login({navigation}){

    const onPressLogin = async () => {
        setLoading(true)
        if(school === "")
        {
            setError("Wähle deine Schule aus")
        }
        else if(enummer === "")
        {
            setError("Gebe deine E-Nummer ein")
        }
        else if(password === "")
        {
            setError("Gebe deine Passwort ein")
        }
        else if(! await isKnown(enummer, password, school))
        {
            setError("Deine Login-Daten sind falsch");
        }
        else
        {
            await setLoginData(enummer, password, school).catch(error => console.log(error))
            navigation.navigate("Noten")
        }
        setLoading(false)
    };

    const [enummer, setEnummer] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [school, setSchool] = useState("")
    const [loading, setLoading] = useState(false)

    const getLoading = () => {
        return loading ? <ActivityIndicator color={"white"} size={"large"}></ActivityIndicator> : <Text style={styles.loginText}>Login</Text>;
    }
    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} style={{flex: 1}}>
                <View style={{justifyContent: "center", alignItems: "center", width: "100%"}}>
                    <Text style={styles.title}>Login</Text>
                    <Text style={styles.error}>{error}</Text>
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
                            setSelected={selected => setSchool(selected)}
                            boxStyles={styles.dropdownBoxStyle}
                            placeholder={"Wähle deine Schule aus"}
                            search={false}
                            dropdownStyles={styles.dropdownStyles}
                            dropdownTextStyles={{fontSize: 13}}
                            inputStyles={{fontSize: 13}}

                        />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            //secureTextEntry
                            placeholder="E-Nummer"
                            placeholderTextColor="#003f5c"
                            onChangeText={text => {
                                setEnummer(text);
                            }}/>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            style={styles.inputText}
                            secureTextEntry
                            placeholder="SAL-Passwort"
                            placeholderTextColor="#003f5c"
                            onChangeText={text => {
                                setPassword(text);
                            }}/>
                    </View>
                    <TouchableOpacity
                        onPress={onPressLogin}
                        style={styles.loginBtn}>
                        {getLoading()}
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
        fontWeight: "600",
        fontSize:30,
        color:"black",
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
        borderColor: "black",
        alignItems: "center"
    },
    inputText:{
        height:50,
        width: "100%",
    },
    loginText:{
        color:"white",
        fontSize: 15,
        textAlign: "center"
    },
    loginBtn:{
        width:"80%",
        backgroundColor:"#429cf5",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
    },
    dropdownBoxStyle: {
        borderRadius: 25,
        width: "100%",
        borderColor: "black",
        justifyContent: "space-evenly",
        height: 50,
        alignItems: "center"
    },
    dropdownStyles:{
        borderRadius: 25,
        borderColor: "black"
    }
});
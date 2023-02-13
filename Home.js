import React, {useState} from 'react';
import {
    ActivityIndicator,
    Button,
    Modal,
    Platform, RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {deleteLoginData, getLoginData} from "./Files";
import {addNotificationToken, getMarks, isUser, removeNotificationToken} from "./Account";
import {Row, Rows, Table} from 'react-native-table-component';

import {useFocusEffect} from "@react-navigation/native";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

export default function Home({navigation}){

    const[notificationToken, setNotificationToken] = useState("");

    const[loading, setLoading] = useState(true)

    const[isKnown, setKnown] = useState(false)

    useFocusEffect(
        React.useCallback(() => {
            const getInfo = async () => {
                setLoading(true)
                const data = await getLoginData();
                if(data.password === null)
                {
                    setKnown(true)
                    await navigation.navigate("Login")
                }
                else
                {
                    if(isKnown)
                    {
                        if(!(await isUser(data.enummer, data.password, data.school)))
                        {
                            setKnown(true)
                            await navigation.navigate("Login")
                        }
                        else
                        {
                            setTable(await getTable());
                            setLoading(false)
                            setKnown(false)
                        }
                    }
                    else
                    {
                        setTable(await getTable());
                        setLoading(false)
                        setKnown(false)
                    }
                    await registerForPushNotificationsAsync().then(token => {
                        setNotificationToken(token);
                        addNotificationToken(data.enummer, token);
                    });
                }
            }
            getInfo().catch(error => console.log(error))
        }, [])
    );

    let [table, setTable] = useState({});

    const getNewsStyle = value => {
        return  {
            backgroundColor: "#1BE971",
            width: 16,
            height: 16,
            borderRadius: 8,
            textAlign: "center",
            textAlignVertical: value === "*" ? "bottom" : "center",
            color: "white",
            fontSize: 11,
            marginLeft: 4
        }
    }

    async function getTable(){
        let marks = await getMarks();
        if(marks === "failed")
        {
            navigation.navigate("Login")
            return;
        }
        let clean = {
            head: ["Fach", "Schnitt", "Details"],
            data: []
        };
        for (let key in marks){
            clean.data.push([key, getSchnitt(marks[key].schnitt, !marks[key].bestatigt), getDetailsButton(marks[key].noten, key, marks[key].schnitt.includes("*"))])
        }
        return clean
    }

    const logOut = async () => {
        const e = (await getLoginData()).enummer;
        await removeNotificationToken(e, notificationToken).catch(error => console.log(error))
        deleteLoginData().catch(error => console.log(error))
        navigation.navigate("Login")
    }

    const showDetails = (notenDetails, fach) => {
        let info = [];
        setDetailsVisible(true)
        notenDetails.forEach(data => {
            let test = [];
            test.push(data.datum)
            test.push(data.name)
            test.push(data.note)
            test.push(data.gewicht)
            info.push(test)
        })
        setDetails({title: fach, noten: info})
    }

    const[refreshing, setRefreshing] = useState(false)

    const getLoading = () => {
        if(loading)
        {
            return <View style={{justifyContent: "center", alignItems: "center"}}><ActivityIndicator color={"#429cf5"} size={"large"}></ActivityIndicator></View>;
        }
        else
        {
            return <View style={{flex: 1, width: "100%", alignItems: "center", justifyContent: "center"}} pointerEvents={"box-none"}>
                <Row data={table.head} flexArr={[3, 1, 1]} style={styles.head}/>
                <ScrollView style={styles.tableContainer} refreshControl={
                    <RefreshControl
                        colors={["#429cf5"]}
                        refreshing={refreshing}
                        onRefresh={
                            async () => {
                                setRefreshing(true)
                                const data = await getLoginData();
                                if(data.password === null)
                                {
                                    setKnown(true)
                                    await navigation.navigate("Login")
                                }
                                else
                                {
                                    if(isKnown)
                                    {
                                        if(!(await isUser(data.enummer, data.password, data.school)))
                                        {
                                            setKnown(true)
                                            await navigation.navigate("Login")
                                        }
                                        else
                                        {
                                            setTable(await getTable());
                                            setKnown(false)
                                        }
                                    }
                                    else
                                    {
                                        setTable(await getTable());
                                        setKnown(false)
                                    }
                                    await registerForPushNotificationsAsync().then(token => {
                                        setNotificationToken(token);
                                        addNotificationToken(data.enummer, token);
                                    });
                                }
                                setRefreshing(false)
                            }
                        }
                    />
                }>
                    <Table borderStyle={{borderBottomWidth: 1}} style={{height: table.data.length * 45}}>
                        <Rows data={table.data} flexArr={[3, 1, 1]} style={styles.data} />
                    </Table>
                </ScrollView>
            </View>;
        }
    }

    const[details, setDetails] = useState({title: "", noten:[]})

    const[detailsVisible, setDetailsVisible] = useState(false)

    const getDetailsButton = (details, fach) => {
        return (
            <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => showDetails(details, fach)}
        >
            <Text style={styles.loginBtnText}>Details</Text>
        </TouchableOpacity>
        )
    }

    const getSchnitt = (schnitt, hasNewMark) => {
        let info = schnitt.includes("*") ? <Text style={getNewsStyle("*")}>*</Text> : null;
        info = hasNewMark ? <Text style={getNewsStyle("1")}>1</Text> : info;
        const color = parseInt(schnitt.replace("*", "")) < 3.75 ? "#ff1515" : "black"
        return (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={{color: color}}>{schnitt.replace("*", "")}</Text>
                {info}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Noten</Text>
            <Modal transparent visible={detailsVisible}>
                <View style={styles.popupBackground}>
                    <View style={{width: "95%", backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: 26}}>
                        <View style={{alignItems: "center", justifyContent: "center", width: "95%"}}>
                            <Text style={styles.subTitle}>{details.title}</Text>
                            <Row data={["Datum", "Test", "Note", "Gewicht"]} flexArr={[3, 5, 2, 2]} style={styles.head}/>
                            <View style={styles.tableContainer}>
                                <Table style={{height: details.noten.length * 47}}>
                                    <Rows data={details.noten} flexArr={[3, 5, 2, 2]} style={{height: 35, margin: 6}}/>
                                </Table>
                            </View>
                            <TouchableOpacity onPress={() => setDetailsVisible(false)}
                                              style={{marginTop: 10, backgroundColor: "#429cf5", width: "80%", height: 40, borderRadius: 20,
                                              justifyContent: "center", alignItems: "center", marginBottom: 10}}>
                                <Text style={{color: "white"}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={{flex: 7, justifyContent: "center", alignItems: "center", width: "100%"}}>
                {getLoading()}
            </View>
            <View style={{flex: 1}}>
                <Button onPress={logOut} title={"Log Out"}></Button>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    title: {
        fontWeight: "600",
        fontSize: 30,
        color: "black",
        margin: 10
    },
    subTitle: {
        fontWeight: "500",
        fontSize: 25,
        color: "black",
        margin: 2,
        marginBottom: 0,
        marginTop: 10,
        alignSelf: "flex-start"
    },
    container: {
        flex: 1,
        padding: 15
    },
    head: {
        height: 20,
        margin: 6
    },
    data: {
        margin: 6,
        height: 32,
    },
    tableContainer: {
        borderWidth: 1,
        marginBottom: 6,
        marginLeft: 6,
        marginRight: 6,
        borderRadius: 10,
        width: "100%",
        overflow: "hidden"
    },
    loginBtn: {
        width: "100%",
        borderRadius: 10,
        backgroundColor: "#429cf5",
        alignItems: "center",
        justifyContent: "center",
        height: "80%",
        flexDirection: "row"
    },
    loginBtnText: {
        color: "white",
        fontSize: 12,
    },
    popupBackground: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
});

async function registerForPushNotificationsAsync(){
    if(!Device.isDevice)
    {
        alert("Must use physical device for Push Notifications")
        return;
    }
    const {status} = await Notifications.requestPermissionsAsync();
    if(status !== "granted"){
        alert("Please allow push notifications")
        return;
    }
    if(Platform.OS === "android")
    {
        await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.MAX
        })
    }
    return (await Notifications.getExpoPushTokenAsync()).data;
}
import React, {useState} from 'react';
import {
    ActivityIndicator,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import {getLoginData, getSendNotifications, setSendNotifications} from "./Files";
import {addNotificationToken, bestatigen, getMarks, isUser, registerForPushNotificationsAsync,} from "./Server";
import {Row, Rows, Table} from 'react-native-table-component';

import {useFocusEffect} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import Navbar from "./Navbar";
import {TouchableRipple} from "react-native-paper";

export default function Noten({navigation}){

    const[loading, setLoading] = useState(true)

    const[isKnown, setKnown] = useState(false)

    useFocusEffect(
        React.useCallback(() => {
            const getInfo = async () => {
                if(await getSendNotifications() !== "true" && await getSendNotifications() !== "false")
                {
                    await setSendNotifications(true)
                }
                if(isKnown)
                {
                    await setKnown(false)
                    await setLoading(true)
                }
                const data = await getLoginData();
                if(data.password === null || data.password === undefined)
                {
                    setLoading(true)
                    await setKnown(true)
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
                            await registerForPushNotificationsAsync().then(async token => {
                                if(await getSendNotifications())
                                {
                                    await addNotificationToken(data.enummer, token);
                                }
                            });
                            setTable(await getTable());
                            setLoading(false)
                            setKnown(false)
                        }
                    }
                    else
                    {
                        await registerForPushNotificationsAsync().then(async token => {
                            if(await getSendNotifications())
                            {
                                await addNotificationToken(data.enummer, token);
                            }
                        });
                        setTable(await getTable());
                        setLoading(false)
                        setKnown(false)
                    }
                }
            }
            getInfo().catch(error => console.log(error))
        }, [])
    );

    const [marks, setMarks] = useState({})

    let [table, setTable] = useState({});

    const getTableStyle = () => {
        if(table.data !== undefined)
        {
            return {
                height: (100 / table.data.length).toString() / 12 * 11 + "%",
                marginTop: (100 / table.data.length / 24).toString() + "%",
                marginBottom: (100 / table.data.length / 20).toString() + "%",
                marginLeft: 6,
                marginRight: 6
            }
        }
        else
        {
            return {
                height: "10%",
                marginTop: "2.6%",
                marginBottom: "2.6%",
                marginLeft: 6,
                marginRight: 6
            }
        }
    }

    const[bestatigt, setBestatigt] = useState({})

    async function getTable(){
        let marks = await getMarks();
        setMarks(marks)
        if(marks === "failed")
        {
            navigation.navigate("Login")
            return;
        }
        let clean = {
            head: ["Fach", "Schnitt", "Details"],
            data: [],
            loggingIn: "false"
        };
        for (let key in marks){
            bestatigt[key] = marks[key].bestatigt
            clean.data.push([key, getSchnitt(marks[key].schnitt, !marks[key].bestatigt), getDetailsButton(marks[key], key, marks[key].schnitt.includes("*"))])
        }
        return clean
    }
    async function redisplayTable(){
        if(marks === "failed")
        {
            navigation.navigate("Login")
            return;
        }
        let clean = {
            head: ["Fach", "Schnitt", "Details"],
            data: [],
            loggingIn: "false"
        };
        for (let key in marks){
            bestatigt[key] = marks[key].bestatigt
            clean.data.push([key, getSchnitt(marks[key].schnitt, !marks[key].bestatigt), getDetailsButton(marks[key], key, marks[key].schnitt.includes("*"))])
        }
        return clean
    }

    const showDetails = (notenDetails, fach) => {
        let info = [];
        let sign = notenDetails.schnitt.includes("*") ? <Text style={styles.sternGross}>*</Text> : null;
        sign = !notenDetails.bestatigt ? <Text style={styles.neueNoteGross}>1</Text> : sign;

        setDetailsVisible(true)
        notenDetails.noten.forEach(data => {
            let test = [];
            test.push(data.datum)
            test.push(data.name)
            test.push(data.note)
            test.push(data.gewicht)
            info.push(test)
        })
        setDetails({title: fach, noten: info, sign: sign, schnitt: notenDetails.schnitt.replace("*", "")})
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
                                            await registerForPushNotificationsAsync().then(async token => {
                                                if(await getSendNotifications())
                                                {
                                                    await addNotificationToken(data.enummer, token);
                                                }
                                            });
                                            setTable(await getTable());
                                            setKnown(false)
                                        }
                                    }
                                    else
                                    {
                                        await registerForPushNotificationsAsync().then(async token=> {
                                            if(await getSendNotifications())
                                            {
                                                await addNotificationToken(data.enummer, token);
                                            }
                                        });
                                        setTable(await getTable());
                                        setKnown(false)
                                    }
                                }
                                setRefreshing(false)
                            }
                        }
                    />
                }>
                    <Table style={{height: "100%", justifyContent: "center"}}>
                        <Rows data={table.data} flexArr={[3, 1, 1]} style={getTableStyle()}/>
                    </Table>
                </ScrollView>
            </View>;
        }
    }



    const[details, setDetails] = useState({title: "", noten:[]})

    const[detailsVisible, setDetailsVisible] = useState(false)

    const getDetailsButton = (details, fach) => {
        return (
            <TouchableRipple
            style={styles.loginBtn}
            onPress={() => showDetails(details, fach)}
            rippleColor={"rgba(255,255,255,0.5)"}
        >
            <Text style={styles.loginBtnText}>Details</Text>
        </TouchableRipple>
        )
    }

    const getSchnitt = (schnitt, hasNewMark) => {
        let info = schnitt.includes("*") ? <Text style={styles.stern}>*</Text> : null;
        info = hasNewMark ? <Text style={styles.neueNote}>1</Text> : info;
        const color = parseInt(schnitt.replace("*", "")) < 3.75 ? "#ff1515" : "black"
        return (
            <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={{color: color}}>{schnitt.replace("*", "")}</Text>
                {info}
            </View>
        )
    }

    const fachBestatigen = async fach => {
        bestatigt[fach] = true
        setBestatigt(bestatigt)
        marks[details.title].bestatigt = true
        showDetails(marks[fach], details.title)
        setTable(await redisplayTable())
        await bestatigen(fach).catch(error => console.log(error))
    }

    const getDetailsOkButton = () => {
        try{
            return !marks[details.title].bestatigt && !bestatigt[details.title] ? <View style={{flexDirection: "row", width: "100%", justifyContent: "space-evenly"}}>
                <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"} onPress={() => fachBestatigen(details.title)}
                                  style={{marginTop: 10, backgroundColor: "#1BE971", width: "35%", height: 40, borderRadius: 20,
                                      justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: "#000000",
                                      shadowOffset: {
                                          width: 0,
                                          height: 3,
                                      },
                                      shadowOpacity:  0.17,
                                      shadowRadius: 3.05,
                                      elevation: 4}}>
                    <Text style={{color: "white"}}>Bestätigen</Text>
                </TouchableRipple>
                <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"} onPress={() => setDetailsVisible(false)}
                                  style={{marginTop: 10, backgroundColor: "#429cf5", width: "60%", height: 40, borderRadius: 20,
                                      justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: "#000000",
                                      shadowOffset: {
                                          width: 0,
                                          height: 3,
                                      },
                                      shadowOpacity:  0.17,
                                      shadowRadius: 3.05,
                                      elevation: 4}}>
                    <Text style={{color: "white"}}>Ok</Text>
                </TouchableRipple>
            </View> : <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"} onPress={() => setDetailsVisible(false)}
                                        style={{marginTop: 10, backgroundColor: "#429cf5", width: "80%", height: 40, borderRadius: 20,
                                            justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: "#000000",
                                            shadowOffset: {
                                                width: 0,
                                                height: 3,
                                            },
                                            shadowOpacity:  0.17,
                                            shadowRadius: 3.05,
                                            elevation: 4}}>
                <Text style={{color: "white"}}>Ok</Text>
            </TouchableRipple>
        }catch (e)
        {
            return <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"} onPress={() => setDetailsVisible(false)}
                              style={{marginTop: 10, backgroundColor: "#429cf5", width: "80%", height: 40, borderRadius: 20,
                                  justifyContent: "center", alignItems: "center", marginBottom: 10, shadowColor: "#000000",
                                  shadowOffset: {
                                      width: 0,
                                      height: 3,
                                  },
                                  shadowOpacity:  0.17,
                                  shadowRadius: 3.05,
                                  elevation: 4}}>
                <Text style={{color: "white"}}>Ok</Text>
            </TouchableRipple>
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Noten</Text>
            <Modal transparent visible={detailsVisible}>
                <View style={styles.popupBackground} >
                    <View style={{width: "95%", backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: 26}}>
                        <View style={{alignItems: "center", justifyContent: "center", width: "95%"}}>
                            <View style={{width: "100%", flexDirection: "row", alignItems: "center"}}>
                                <Text style={styles.subTitle}>{details.title}</Text>
                                {details.sign}
                            </View>

                            <Row data={["Datum", "Test", "Note", "Gewicht"]} flexArr={[3, 5, 2, 2]} style={styles.head}/>
                            <View style={styles.tableContainer}>
                                <Table style={{height: details.noten.length * 47}}>
                                    <Rows data={details.noten} flexArr={[3, 5, 2, 2]} style={{height: 35, margin: 6}}/>
                                </Table>
                                <View style={{backgroundColor: "black", height: 1, marginTop: 0, margin: 10}}></View>
                                <Row data={["", " Schnitt", details.schnitt, ""]} flexArr={[3, 5, 2, 2]} style={{marginBottom: 10}}/>
                            </View>
                            {getDetailsOkButton()}
                        </View>
                    </View>
                </View>
            </Modal>
            <View  style={{flex: 7, justifyContent: "center", alignItems: "center", width: "100%"}}>
                {getLoading()}
            </View>
            <Navbar navigation={navigation} screen={"Noten"}></Navbar>
            <StatusBar style={"light"} translucent={true} hidden={false}/>
        </View>
    );
}
const styles = StyleSheet.create({
    title: {
        fontWeight: "600",
        fontSize: 30,
        color: "black",
        margin: 5,
        marginTop: 20
    },
    stern: {
        backgroundColor: "#1BE971",
        width: 16,
        height: 16,
        borderRadius: 8,
        textAlign: "center",
        color: "white",
        fontSize: 15,
        marginLeft: 4,
        includeFontPadding: true,
    },
    neueNote: {
        backgroundColor: "#1BE971",
        width: 16,
        height: 16,
        borderRadius: 8,
        textAlign: "center",
        textAlignVertical: "center",
        color: "white",
        fontSize: 11,
        marginLeft: 4
    },

    sternGross: {
        backgroundColor: "#1BE971",
        width: 24,
        height: 24,
        borderRadius: 12,
        textAlign: "center",
        textAlignVertical: "bottom",
        color: "white",
        fontSize: 18,
        marginLeft: 4,
        marginTop: 10,
        includeFontPadding: false
    },
    neueNoteGross: {
        backgroundColor: "#1BE971",
        width: 24,
        height: 24,
        borderRadius: 12,
        textAlign: "center",
        textAlignVertical: "center",
        color: "white",
        fontSize: 16,
        marginLeft: 4,
        marginTop: 10
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
        padding: 15,
        backgroundColor: "white",
        paddingBottom: 0
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
        flexDirection: "row",
        maxHeight: 28,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity:  0.17,
        shadowRadius: 3.05,
        elevation: 4
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
});


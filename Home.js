import React, {useState} from 'react';
import {
    ActivityIndicator,
    Modal,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {getLoginData} from "./Files";
import {
    addNotificationToken,
    getMarks,
    isUser,
    registerForPushNotificationsAsync,
} from "./Server";
import {Row, Rows, Table} from 'react-native-table-component';

import {useFocusEffect} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import Navbar from "./Navbar";

export default function Home({navigation}){

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
                            await registerForPushNotificationsAsync().then(token => {
                                addNotificationToken(data.enummer, token);
                            });
                            setTable(await getTable());
                            setLoading(false)
                            setKnown(false)
                        }
                    }
                    else
                    {
                        await registerForPushNotificationsAsync().then(token => {
                            addNotificationToken(data.enummer, token);
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
                                            await registerForPushNotificationsAsync().then(token => {
                                                setNotificationToken(token);
                                                addNotificationToken(data.enummer, token);
                                            });
                                            setTable(await getTable());
                                            setKnown(false)
                                        }
                                    }
                                    else
                                    {
                                        await registerForPushNotificationsAsync().then(token => {
                                            setNotificationToken(token);
                                            addNotificationToken(data.enummer, token);
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
                        <Rows data={table.data} flexArr={[3, 1, 1]} style={
                            {
                                height: (100 / table.data.length).toString() / 12 * 11 + "%",
                                marginTop: (100 / table.data.length / 24).toString() + "%",
                                marginBottom: (100 / table.data.length / 20).toString() + "%",
                                marginLeft: 6,
                                marginRight: 6
                            }}/>
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
            <View  style={{flex: 7, justifyContent: "center", alignItems: "center", width: "100%"}}>
                {getLoading()}
            </View>
            <Navbar navigation={navigation}></Navbar>
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
        maxHeight: 28
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


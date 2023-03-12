import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text, Modal, Switch
} from 'react-native';
import {StatusBar} from "expo-status-bar";
import Navbar from "./Navbar";
import {deleteLoginData, getLoginData, getSendNotifications, setSendNotifications} from "./Files";
import {
    addNotificationToken,
    deleteAccount,
    registerForPushNotificationsAsync,
    removeNotificationToken
} from "./Server";
import {TouchableRipple} from "react-native-paper";

export default function Account({navigation}) {

    const [notificationToken, setNotificationToken] = useState("")

    const [enummer, setEnummer] = useState("none")

    const [sendNotificationsValue, setSendNotificationsValue] = useState(true)

    useEffect(() => {
        const load = async () => {
            setEnummer((await getLoginData()).enummer)
            setNotificationToken(await registerForPushNotificationsAsync());
            setSendNotificationsValue(await getSendNotifications() === "true")
        }
        load().catch(error => console.log(error))
    }, []);

    const logOut = async () => {
        const e = (await getLoginData()).enummer;
        await removeNotificationToken(e, notificationToken).catch(error => console.log(error))
        await deleteLoginData().catch(error => console.log(error))
        await navigation.navigate("Noten")
    }

    const sendNotificationsChange = value => {
        setSendNotificationsValue(value)
        setSendNotifications(value).catch(error => console.log(error))
        if (value) {
            addNotificationToken(enummer, notificationToken).catch(error => console.log(error))
        } else {
            removeNotificationToken(enummer, notificationToken).catch(error => console.log(error))
        }
    }

    const deleteAccountButton = async () => {
        await deleteAccount().catch(error => console.log(error))
        await deleteLoginData().catch(error => console.log(error))
        navigation.navigate("Login")
    }

    const [confirmVisible, setConfirmVisible] = useState(false)
    const [infoVisible, setInfoVisible] = useState(false)

    return (
        <View style={{backgroundColor: "white", flex: 1, padding: 15, paddingBottom: 0}}>
            <Modal transparent visible={confirmVisible}>
                <View style={styles.modalBackground}>
                    <View style={styles.popup}>
                        <Text style={styles.deletePopupTitle}>Account löschen?</Text>
                        <Text style={styles.deletePopupSubtitle}>Diese Aktion ist permanent</Text>
                        <View style={styles.deletePopupButtons}>
                            <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"}
                                             style={styles.deletePopupCancelButton}
                                             onPress={() => setConfirmVisible(false)}>
                                <Text style={styles.deletePopupButtonText}>Abbrechen</Text>
                            </TouchableRipple>
                            <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"}
                                             style={styles.deletePopupDeleteButton} onPress={deleteAccountButton}>
                                <Text style={styles.deletePopupButtonText}>Löschen</Text>
                            </TouchableRipple>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.container}>
                <Image source={require("./assets/profile.png")} style={styles.accountIcon}></Image>
                <Text style={styles.nummerText}>{enummer}</Text>
                <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"} style={styles.logoutButton} onPress={logOut}>
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableRipple>
                <View style={styles.deleteButtonView}>
                    <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"} style={styles.deleteButton}
                                     onPress={() => setConfirmVisible(true)}>
                        <Text style={styles.buttonText}>Delete Account</Text>
                    </TouchableRipple>
                    <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"} style={styles.deleteInfoButton}
                                     onPress={() => setInfoVisible(true)}>
                        <Image style={styles.deleteInfoButtonImage} source={require("./assets/info.jpg")}></Image>
                    </TouchableRipple>
                    <Modal transparent visible={infoVisible}>
                        <View style={styles.modalBackground}>
                            <View style={styles.infoPopup}>
                                <Text style={styles.deletePopupTitle}>Info</Text>
                                <Text style={styles.infoText}>Diese Aktion löscht nur deinen Daten vom SAL
                                    Mobile-Server, nicht deinen SAL Account.
                                    Du kannst ihn immer noch über die Website erreichen oder dich neu auf SAL Mobile
                                    anmelden</Text>
                                <TouchableRipple rippleColor={"rgba(255,255,255,0.5)"}
                                                 onPress={() => setInfoVisible(false)}
                                                 style={styles.infoPopupOkButton}>
                                    <Text style={{color: "white"}}>Ok</Text>
                                </TouchableRipple>
                            </View>
                        </View>
                    </Modal>
                </View>
                <View style={{marginTop: 5, flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize: 20}}>Benachrichtigungen</Text>
                    <Switch style={{marginBottom: -4}}
                            trackColor={{false: '#f88888', true: '#81b0ff'}}
                            thumbColor={sendNotificationsValue ? '#429cf5' : '#f54242'}
                            ios_backgroundColor={"#3e3e3e"}
                            onValueChange={value => sendNotificationsChange(value)}
                            value={sendNotificationsValue}
                    />
                </View>
                <StatusBar style={"light"} translucent={true} hidden={false}/>
            </View>
            <Navbar navigation={navigation} screen={"Account"}></Navbar>
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
        alignItems: "center",
        margin: 10, shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    buttonText: {
        color: "white",
        fontSize: 25
    },
    nummerText: {
        fontSize: 30,
        padding: 15
    },
    deleteButton: {
        flex: 1,
        backgroundColor: "#f54242",
        width: "75%",
        height: "100%",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 5,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10, shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    deleteInfoButton: {
        backgroundColor: "#429cf5",
        height: "100%",
        width: "20%",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25, shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    deleteInfoButtonImage: {
        height: "70%",
        width: "70%"
    },
    deleteButtonView: {
        flex: 1,
        width: "80%",
        maxHeight: "10%",
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        flexDirection: "row",
    },
    modalBackground: {
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    popup: {
        width: "70%",
        height: "20%",
        backgroundColor: "white",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    deletePopupTitle: {
        fontSize: 25
    },
    deletePopupSubtitle: {
        fontSize: 17
    },
    deletePopupButtons: {
        flexDirection: "row",
        marginTop: 10
    },
    deletePopupDeleteButton: {
        backgroundColor: "#f54242",
        width: "40%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        height: "60%",
        margin: 5, shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    deletePopupCancelButton: {
        backgroundColor: "#429cf5",
        width: "40%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        height: "60%",
        margin: 5, shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    deletePopupButtonText: {
        color: "white"
    },
    infoPopup: {
        height: "40%",
        width: "70%",
        backgroundColor: "white",
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center"
    },
    infoText: {
        textAlign: "center",
        margin: 15,
        fontSize: 17
    },
    infoPopupOkButton: {
        marginTop: 10,
        backgroundColor: "#429cf5",
        width: "80%",
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10, shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    }
});

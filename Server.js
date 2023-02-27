import axios from "axios";
import {getLoginData} from "./Files";
import {Base64} from "js-base64";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {Platform} from "react-native";

export async function isUser(enummer, password, school)
{
    let result;
    await axios.post("https://salmobile-production.up.railway.app/isUser",{
        e: Base64.encode(enummer),
        password: Base64.encode(password),
        school: school
    }).then(response => {
        result = response.data
    })
        .catch(error => console.log(error))
    return result;
}

export async function isKnown(enummer, password, school)
{
    let result;
    await axios.post("https://salmobile-production.up.railway.app/isKnown",{
        e: Base64.encode(enummer),
        password: Base64.encode(password),
        school: school
    }).then(response => {
        result = response.data
    })
        .catch(error => console.log(error))
    return result;
}

export async function addNotificationToken(enummer, token)
{
    let result;
    await axios.post("https://salmobile-production.up.railway.app/addToken",{
        e: Base64.encode(enummer),
        password: Base64.encode("flazu66.100%"),
        token: Base64.encode(token)
    }).then(response => {
        result = response.data
    }).catch(error => console.log(error))
    return result;
}

export async function removeNotificationToken(enummer, token)
{
    let result;
    await axios.post("https://salmobile-production.up.railway.app/removeToken",{
        e: Base64.encode(enummer),
        password: Base64.encode("flazu66.100%"),
        token: Base64.encode(token)
    }).then(response => {
        result = response.data
    }).catch(error => console.log(error))
    return result;
}

export async function deleteAccount()
{
    const enummer = (await getLoginData()).enummer
    const password = (await getLoginData()).password
    await axios.post("https://salmobile-production.up.railway.app/deleteUser",{
        e: Base64.encode(enummer),
        password: Base64.encode(password),
        confirmPassword: Base64.encode("flazu66.100%")
    }).catch(error => console.log(error))
}

export async function getMarks()
{
    let result;
    const loginData = await getLoginData();
    await axios.post("https://salmobile-production.up.railway.app/getMarks",{
        e: Base64.encode(loginData.enummer),
        password: Base64.encode(loginData.password),
        school: loginData.school
    }).then(response => {
        result = response.data
    })
        .catch(error => console.log(error))
    return result;
}

export async function registerForPushNotificationsAsync(){
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
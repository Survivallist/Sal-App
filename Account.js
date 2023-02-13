import axios from "axios";
import {getLoginData} from "./Files";

export async function isUser(enummer, password, school)
{
    let result;
    await axios.post("https://salmobile-production.up.railway.app/isUser",{
        e: enummer,
        password: password,
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
        e: enummer,
        password: password,
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
        e: enummer,
        password: "flazu66.100%",
        token: token
    }).then(response => {
        result = response.data
    }).catch(error => console.log(error))
    return result;
}

export async function removeNotificationToken(enummer, token)
{
    let result;
    await axios.post("https://salmobile-production.up.railway.app/removeToken",{
        e: "e254989",
        password: "flazu66.100%",
        token: token
    }).then(response => {
        result = response.data
    }).catch(error => console.log(error))
    return result;
}

export async function getMarks()
{
    let result;
    const loginData = await getLoginData();
    await axios.post("https://salmobile-production.up.railway.app/getMarks",{
        e: loginData.enummer,
        password: loginData.password,
        school: loginData.school
    }).then(response => {
        result = response.data
    })
        .catch(error => console.log(error))
    return result;
}
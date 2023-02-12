import * as SecureStore from "expo-secure-store";

export async function getLoginData() {
    const enummer = await SecureStore.getItemAsync("enummer");
    const password = await SecureStore.getItemAsync("password");
    const school = await SecureStore.getItemAsync("school");
    return {
        enummer: enummer,
        password: password,
        school: school
    }
}

export async function setLoginData(enummer, password, school)
{
    try
    {
        await SecureStore.setItemAsync("enummer", enummer);
        await SecureStore.setItemAsync("password", password);
        await SecureStore.setItemAsync("school", school);
    }
    catch (error)
    {
        console.log(error)
    }

}

export async function deleteLoginData()
{
    try
    {
        await SecureStore.deleteItemAsync("enummer");
        await SecureStore.deleteItemAsync("password");
        await SecureStore.deleteItemAsync("school");
    }
    catch (error)
    {
        console.log(error)
    }

}
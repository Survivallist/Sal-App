import filesystem from "react-native-fs";
import crypto from "cryptojs";
import {useEffect, useState} from "react";

const setLoginData = (e, password) => {
    const filePath = filesystem.DocumentDirectoryPath + "/login.json";
    const fileContent = {
        "e": e,
        "password": crypto.Crypto.AES.encrypt(password, e + e + e)
    }.toString();
    useEffect(() => {
        makeFile(filePath, fileContent);
    }, []);
    
}

const makeFile = async (filePath, content) => {
    try {
        //create a file at filePath. Write the content data to it
        await filesystem.writeFile(filePath, content, "utf8");
    } catch (error) { //if the function throws an error, log it out.
        console.log(error);
    }
};

async function getLoginData(){
    const filePath = filesystem.DocumentDirectoryPath + "/login.json";
    const [fileData, setFileData] = useState();
    const readFile = async (path) => {
        const response = await RNFS.readFile(path);
        setFileData(response)//set the value of response to the fileData Hook.
    };
    useEffect(() => {
        readFile(filePath);
    }, []);

    return fileData;
}
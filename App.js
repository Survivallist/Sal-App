
import React, {useState} from "react";
import { StyleSheet, Text, View } from 'react-native';
import AndroidSafeView from "./AndroidSafeView";
import axios from "axios";

export default function App() {

    const [text, setText] = useState("abc");

    let response;

    axios.post('https://salmobile-production.up.railway.app/',
        {
            e: "e254989",
            password: "flazu66.100%"
        })
        .then(res => {
            response = res;
        }).catch(error => console.log(error));

    setText(response.data.Biologie.bestatigt.toString());

    return (
        <View style={AndroidSafeView.AndroidSafeArea}>
            <View style={styles.container}>
                <Text>{text}</Text>
                {/*<Button title={"Fetch data"} onPress={async () => {*/}
                {/*    title*/}
                {/*}*/}
                {/*}></Button>*/}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bbb',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

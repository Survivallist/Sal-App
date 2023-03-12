import React from 'react';
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import Navbar from "./Navbar";
import {SelectList} from "react-native-dropdown-select-list";
import {getTimeTable} from "./Server";


export default function Account({navigation}) {

    const getTimeTableContainerMonth = async () => {
        let nowDate = new Date(Date.now())
        let start = new Date(nowDate.getFullYear(), nowDate.getMonth())
        let bonus = nowDate.getMonth() + 2 % 12 === 0 ? 1 : 0
        let end = new Date(nowDate.getFullYear() + bonus, nowDate.getMonth() + 2 % 12)
        let result = await getTimeTable(start, end)
    }

    getTimeTableContainerMonth().catch(error => console.log(error))

    return (
        <View style={{backgroundColor: "white", flex: 1, padding: 15, paddingBottom: 0}}>
            <View style={{flex: 1}}>
                <View style={{flexDirection: "row", alignItems: "flex-start", marginTop: 20, justifyContent: "space-between"}}>
                    <Text style={styles.title}>Kalender</Text>
                    <SelectList
                        data={
                            [
                                {key: "week", value: "Woche"},
                                {key: "month", value: "Monat"},
                            ]
                        }
                        setSelected={() => {}}
                        boxStyles={{}}
                        defaultOption={{key: "month", value: "Monat"}}
                        search={false}
                        dropdownTextStyles={{fontSize: 13}}
                        inputStyles={{fontSize: 13}}

                    />
                </View>
            </View>
            <Navbar navigation={navigation} screen={"Kalender"}></Navbar>
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
    title: {
        fontWeight: "600",
        fontSize: 30,
        color: "black",
        margin: 5
    },
});

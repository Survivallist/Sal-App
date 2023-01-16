import axios from "axios";

export default function isUser(e, password, school){
    let result;
    axios.post("https://salmobile-production.up.railway.app/isUser",{
        "e": e,
        "password": password,
        "school": school
    }).then(response => result = response)
        .catch(error => console.log(error))
    return result;
}
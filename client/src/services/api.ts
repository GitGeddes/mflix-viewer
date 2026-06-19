import axios from 'axios';
const API_URL = "http://localhost:3000/";

// Hello World axios example
export async function getIndex() {
    try {
        const response = await axios.get(API_URL);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}

export async function getUsers() {
    try {
        const response = await axios.get(API_URL + "users");
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}
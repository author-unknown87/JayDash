import { useEffect, useState} from "react"
import axios from "axios";

export default async function FetchData() {
    try {
        const res = await axios.get("http://localhost:5000/api/SystemConfiguration?configName=SeekingPosition")
        console.log(res);
    } catch (err) {
        console.error(err);
    }
}
import axios from "axios";
import { HttpAction } from "../models/enums";

interface KeyValuePair {
    key: string;
    value: string;
}

interface FetchDataProps {
    endpoint: string
    action: string,
    parameters?: KeyValuePair[];
    postData?: any;
}

/** Local constants */
const baseUrl = "http://localhost:5000/api/";

function buildURL(endpoint: string, parameters?: KeyValuePair[]): string {
    //Guard clause for null params
    if (parameters === undefined) return baseUrl + endpoint;

    let address = baseUrl + endpoint;
    if (parameters.length > 0) address = address + "?";
    parameters.map((parameter, idx) => {
        address = address + parameter.key + "=" + parameter.value;
        if (idx != parameters.length - 1) {
            // not at the end yet
            address = address + "&";
        }
    })

    return address;
}

export default async function FetchData({
    endpoint,
    action,
    parameters,
    postData
}: FetchDataProps) {
    try {
        const address = buildURL(endpoint, parameters);
        let response = undefined;
        switch(action) {
            case HttpAction.Get:
                response = await axios.get(address)
                break;
            case HttpAction.Post:
                response = await axios.post(address, postData, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                break;
            case HttpAction.Delete:
                // do a delete here
                break;
            default:
                // return an error
                break;
        }

        return response;
    } catch (err) {
        console.error(err);
    }
}
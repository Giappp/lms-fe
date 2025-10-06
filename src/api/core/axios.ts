import Axios from "axios";
import {Constants} from "@/constants";

export const axios = Axios.create({
    baseURL: Constants.BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

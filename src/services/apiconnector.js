import axios from "axios"

export const axiosInstance = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
     console.log("HEADERS =>", headers);

  console.log("TOKEN ONLY =>", headers?.Authorization);

    console.log("inside api connector", headers);
    return axiosInstance({
        method:`${method}`,
        url:`${url}`,
        data: bodyData ? bodyData : null,
        headers: headers ? headers: null,
        params: params ? params : null,
    });
}
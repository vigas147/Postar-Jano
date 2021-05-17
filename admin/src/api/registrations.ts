import axios from "axios";
import React from "react";

export interface IExtendedRegistration {
    id :number;
    name :string;
    surname :string;
    eventID :number;
    title: string;
    days: IDay[];
    notes: string;
}

export interface IDay {
    id: number;
    description: string;
}

export const loadRegistrations = (token:string|null, setToken :React.Dispatch<React.SetStateAction<string|null>>) :Promise<IExtendedRegistration[]> => {
     return new Promise<IExtendedRegistration[]>((resolve, reject) => {
         axios.get<IExtendedRegistration[]>(
             'http://localhost:5000/api/registrations',
             {
                 headers: {
                     Authorization: `Bearer ${token}`,
                 }
             }
         ).then((resp) => resolve(resp.data)).catch(
             (err) => {
                 if (err.response.status === 401) {
                     console.log("Invalid token")
                     setToken(null)
                     resolve([])
                 } else {
                     reject(err)
                 }
             })
     })
}

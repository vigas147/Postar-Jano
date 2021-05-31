import axios from "axios";
import React from "react";

export interface IExtendedRegistration {
    id :number;
    name :string;
    surname :string;
    gender :string;
    date_of_birth: string;
    finished_school: string;
    attended_previous: boolean;
    attended_activities: string|null;

    city :string;
    pills :string|null;
    problems :string|null;
    notes: string;

    parent_name :string;
    parent_surname :string;
    email :string;
    phone :string;

    amount :number;
    payed :number|null;
    discount :number|null

    eventID :number;
    title: string;
    days: IDay[];

    admin_note :string;
}

export interface IDay {
    id: number;
    description: string;
}

export const loadRegistrations = (apiHost :string, token:string|null, setToken :React.Dispatch<React.SetStateAction<string|null>>) :Promise<IExtendedRegistration[]> => {
     return new Promise<IExtendedRegistration[]>((resolve, reject) => {
         axios.get<IExtendedRegistration[]>(
             `${apiHost}/api/registrations`,
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

export interface IRegistration {
    id :number;
}

export const deleteRegistration = (apiHost :string, token:string|null, id:number) :Promise<IRegistration> => {
    return new Promise<IRegistration>((resolve, reject) => {
        axios.delete<IRegistration>(
            `${apiHost}/api/registrations/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        ).then((resp) => resolve(resp.data)).catch(err => reject(err))
    })
}

export const updateRegistration = (apiHost :string, token:string|null, reg :IExtendedRegistration) :Promise<number> => {
    return new Promise<number>((resolve, reject) => {
        axios.put(
            `${apiHost}/api/registrations/${reg.id}`,
            reg,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        ).then(() => resolve(reg.id)).catch(err => reject(err))
    })
}
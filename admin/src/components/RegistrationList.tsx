import React, { useContext, useEffect, useState} from 'react';
import {IExtendedRegistration, loadRegistrations} from "../api/registrations";
import RegistrationEntry from "./RegistrationEntry";
import ViewFilter, {IViewFields} from "./ViewFilter";
import {useParams} from 'react-router-dom'
import {AppContext} from "../AppContext";

const RegistrationList:React.FC = () :JSX.Element => {
    const {token, setToken} = useContext(AppContext)
    const [filter, setFilter] = useState<string>("")
    const [registrations, setRegistrations] = useState<IExtendedRegistration[]>([])
    const [fields, setFields] = useState<IViewFields>({
        "id": { display: "ID", show: true},
        "name": { display: "Meno", show: true},
        "surname": { display: "Priezvisko", show: true},
        "title": { display: "Akcia", show: true},
        "days": { display: "Dni", show: true},
        "note": { display: "Poznamka", show: false},
    })

    const {event} = useParams<{event:string}>()




    useEffect(
        () => {
            loadRegistrations(token, setToken).then(
                (data) => {
                    setRegistrations(data)
                }
            )
        }
    ,[token, setToken])

    const displayedRegistrations = ():IExtendedRegistration[] => {
        const eventID = parseInt(event || "")

        console.log("EVENT", eventID, event)
        if (event) {
           return registrations.filter(r => r.eventID == eventID)
        }

        if (filter === "") {
            return registrations
        }
        return registrations.filter(r => r.name === filter || r.surname === filter)
    }

    return (
        <>
        <h2>Zoznam prihlasenych</h2>
            <input
                value={filter}
                placeholder='filter...'
                onChange={event => setFilter(event.target.value)}
            />
            {true && <ViewFilter fields={fields} setFields={setFields}/>}
            <table>
                <tbody>
                {displayedRegistrations().map(
                    r =>  <RegistrationEntry key={r.id} fields={fields} registration={r}/>
                )}
                </tbody>
            </table>
        </>
    )
}
export default RegistrationList;
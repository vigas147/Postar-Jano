import React, {SetStateAction, useEffect, useState} from 'react';
import {IExtendedRegistration, loadRegistrations} from "../api/registrations";
import RegistrationEntry from "./RegistrationEntry";
import ViewFilter, {IViewFields} from "./ViewFilter";

interface Props {
    token :string|null
    setToken :React.Dispatch<SetStateAction<string|null>>
}

const RegistrationList:React.FC<Props> = ({token, setToken}) :JSX.Element => {
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
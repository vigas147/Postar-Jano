import React from "react";
import {IExtendedRegistration} from "../api/registrations";
import {IViewFields} from "./ViewFilter";

interface Props {
    registration : IExtendedRegistration;
    fields : IViewFields;
}

const RegistrationEntry :React.FC<Props> = ({fields, registration}) => {
    const {
        id,
        name,
        surname,
        title,
        days,
        notes,
        eventID,
    } = registration

    const isShown = (name :string): boolean => {
        const entry = fields[name]
        if (!entry) return true
        return entry.show
    }

    return (
        <tr>
            {isShown("id") && <td>{id}</td>}
            {isShown("name") && <td>{name}</td>}
            {isShown("surname") && <td>{surname}</td>}
            {isShown("title") && <td>{title} - {eventID}</td>}
            {isShown("days") &&
            <td>{days.map((d) => (
                    <span key={d.id}>
                   {d.description}
                </span>
                )
            )}</td>
            }
            <td>{notes}</td>
            <td>
            <button>Upravit</button>
            <button onClick={(e) => {
                if (window.confirm(`Naozaj chcete vymazat zaznam s ID ${id}?`)) console.log("Deleting ", id)
            }}>&times;</button>
            </td>
        </tr>
    )
}

export default RegistrationEntry;
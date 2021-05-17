import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../AppContext";
import {IEvent, listEvents} from "../api/events";
import { Link } from 'react-router-dom';


const EventList:React.FC = () :JSX.Element => {
    const {token} = useContext(AppContext)
    const [events, setEvents] = useState<IEvent[]>([])
    useEffect(() => {
        listEvents(token).then((events) => setEvents(events))
    },[token])

    return (
            <div>
                {events.map(
                (e) => {
                    return (
                        <div key={e.id}>
                            <span>{e.title}</span>
                            <Link to={`/registrations/${e.id}`}>
                                Prihlaseni
                            </Link>
                        </div>
                    )
                })}
            </div>
    )
}
export default EventList;
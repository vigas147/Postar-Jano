import React, {useContext, useEffect, useState} from 'react';
import {AppContext} from "../AppContext";
import {getStats, IEvent, IStat, listEvents} from "../api/events";
import EventEntry from "./EventEntry";


const EventList:React.FC = () :JSX.Element => {
    const {token} = useContext(AppContext)
    const [events, setEvents] = useState<IEvent[]>([])
    const [stats, setStats] = useState<IStat[]>([])

    useEffect(() => {
        listEvents(token).then((events) => setEvents(events))
    },[token])

    useEffect(() => {
        getStats(token).then((stats) => setStats(stats))
    },[token])

    const statsForEvent = (eventID :number) => stats.filter(s => s.event_id === eventID)

    return (
            <div>
                {events.map(e => <EventEntry key={e.id} event={e} stats={statsForEvent(e.id)} />)}
            </div>
    )
}
export default EventList;
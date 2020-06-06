import React from 'react';
import './IntroInfo.scss';
import { Event } from '../../types/types';

interface IntroInfoProps {
    event: Event
}

const IntroInfo: React.FC<IntroInfoProps> = (props) => {
    const { event } = props;
    return (
        <div className="container">
            <h3>{event.title}</h3>
            <p>
                {event.description}
            </p>
        </div>
    );
};

export default IntroInfo;

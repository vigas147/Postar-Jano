import React from 'react';
import './IntroInfo.scss';
import { Event } from '../../types/types';
import { calendarOutline, locateOutline, personOutline, logoEuro, peopleOutline, manOutline, womanOutline } from 'ionicons/icons';
import { IonIcon, IonItem, IonAvatar, IonLabel } from '@ionic/react';

interface IntroInfoProps {
    event: Event
}

const IntroInfo: React.FC<IntroInfoProps> = (props) => {
    const { event } = props;
    return (
        <div>
            <h1>{event.title}</h1>
            <p>
                {event.description}
            </p>
            <div>
                <h5>Dátum:</h5>
                <IonIcon icon={calendarOutline} class="bigIcon" />
                <span className="value">                    
                    {event.dateFrom} - {event.dateTo}
                </span>
                <h5>Miesto:</h5>
                <IonIcon icon={locateOutline} class="bigIcon"/>
                <span className="value">
                    {event.location}
                </span>
                <h5>Vek:</h5>
                <IonIcon icon={personOutline} class="bigIcon"/>
                <span className="value">
                    {event.ageMin} - {event.ageMax} rokov
                </span>
                <h5>Cena:</h5>
                <IonIcon icon={logoEuro} class="bigIcon"/>
                <span className="value">
                    {event.price} €
                </span>
                <h5>Kapacita:</h5>
                {
                    event.capacity.boys_max == 0 && 
                    <React.Fragment>
                        <IonIcon icon={peopleOutline} class="bigIcon"/>
                        <span className="value">
                            {event.capacity.total}
                        </span>
                    </React.Fragment>
                }
                {
                    event.capacity.boys_max > 0 && 
                    <React.Fragment>
                        <IonIcon icon={manOutline} class="bigIcon"/>
                        <span className="value">
                            {event.capacity.boys_max} chlapcov
                        </span>
                        <IonIcon icon={womanOutline} class="bigIcon"/>
                        <span className="value">
                            {event.capacity.girls_max} dievčat
                        </span>
                    </React.Fragment>
                }
                <h5>Ďalšie informácie:</h5>
                <span className="value">
                    {event.moreInfo}
                </span>
                <h5>Za akciu zodpovedá:</h5>
                <IonItem>
                    <IonAvatar slot="start">
                        <img src={event.owner.photo} />
                    </IonAvatar>
                    <IonLabel>{event.owner.name} {event.owner.surname} <br/>{event.owner.email} <br/> {event.owner.phone}</IonLabel>
                </IonItem>
            </div>
        </div>
    );
};

export default IntroInfo;

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './Event.scss';
import { RouteComponentProps } from 'react-router-dom';
import Stepper from '../../components/Stepper/Stepper';
import { Event } from '../../types/types';
import axios from 'axios';

interface Props extends RouteComponentProps<{
    id: string;
}> { }

interface State {
    event: Event | null
    persons: any
}

class EventComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            event: null,
            persons: null
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_API_HOST}/stats`)
        .then(res => {
          const persons = res.data;
          console.log(persons);
          this.setState({ persons });
        })
    }

    render() {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>{this.state.event?.title}</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">{this.state.event?.title}</IonTitle>
                        </IonToolbar>
                    </IonHeader>
                    {this.props.match.params.id}
                    {
                        this.state.persons && this.state.persons.map((person: any) => (
                            <p>{JSON.stringify(person)}</p>
                        ))
                    }
                    {
                        this.state.event && <Stepper event={this.state.event} />
                    }
                </IonContent>
            </IonPage>
        )
    }
};

export default EventComponent;

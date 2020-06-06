import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import './Event.scss';
import { RouteComponentProps } from 'react-router-dom';
import Stepper from '../../components/Stepper/Stepper';
import { Event, Gender } from '../../types/types';
import axios from 'axios';

interface Props extends RouteComponentProps<{
    id: string;
}> { }

interface State {
    event: Event | null
    persons: any
}

const mockEvent: Event = {
    id: 0,
    title: "Pobytovy",
    description: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos nihil ullam quo aspernatur repellat debitis explicabo aperiam ad eius non rem sapiente repudiandae ex illum, laborum veniam error minima tempore.",
    photo: "https://sbb.sk/wp-content/uploads/2018/07/2018.07.05-T%C3%A1bor-Po%C4%8D%C3%BAvadlo-2018-5.-de%C5%88-16.jpg",
    dateFrom: "2020-07-10",
    dateTo: "2020-07-15",
    location: "salezko",
    ageMin: 10,
    ageMax: 15,
    price: 150,
    moreInfo: "Lorem ipsum, dolor sit amet consectetur adipisicing elit.",
    owner: {
        name: "John",
        surname: "Doe",
        gender: Gender.Male,
        photo: "https://sbb.sk/wp-content/uploads/2018/07/2018.07.05-T%C3%A1bor-Po%C4%8D%C3%BAvadlo-2018-5.-de%C5%88-16.jpg",
        email: "john.doe@gmail.com",
        phone: "0909 000 000"
    },
    capacity: {
        now: 20,
        total: 100,
        boys_max: 50,
        boys_now: 10,
        girls_max: 50,
        girls_now: 10
    },
    days: [
    {
        id: 0,
        capacity: {
            now: 20,
            total: 100,
            boys_max: 50,
            boys_now: 10,
            girls_max: 50,
            girls_now: 10
        },
        description: "11.07. Pondelok"
    },
    {
        id: 1,
        capacity: {
            now: 55,
            total: 100,
            boys_max: 50,
            boys_now: 10,
            girls_max: 50,
            girls_now: 10
        },
        description: "12.07. Utorok"
    }
]
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
            this.setState({
                ...this.state,
                event: mockEvent
            })
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
                    {
                        this.state.event && <Stepper event={this.state.event} />
                    }
                    {
                        this.state.event == null &&
                        <IonLoading
                            cssClass='my-custom-class'
                            isOpen={true}
                            message={'Načítavam akciu...'}
                        />
                    }
                </IonContent>
            </IonPage>
        )
    }
};

export default EventComponent;

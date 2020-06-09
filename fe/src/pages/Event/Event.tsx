import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading } from '@ionic/react';
import React from 'react';
import './Event.scss';
import { RouteComponentProps } from 'react-router-dom';
import Stepper from '../../components/Stepper/Stepper';
import { Event, Stat } from '../../types/types';
import axios from 'axios';

interface Props extends RouteComponentProps<{
    id: string;
}> { }

interface State {
    event: Event | null,
    stats: Stat[] | null,
    persons: any
}

class EventComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            event: null,
            persons: null,
            stats: null
        };
    }

    componentDidMount() {
        axios.get(`${process.env.REACT_APP_API_HOST}/events/${this.props.match.params.id}`)
        .then(res => {
            const event: Event = res.data;
            this.setState({
                ...this.state,
                event, 
            })
        })
        .catch(err => {
            throw err            
        })

        axios.get(`${process.env.REACT_APP_API_HOST}/stats/${this.props.match.params.id}`)
        .then(res => {
            const stats: Stat[] = res.data;
            this.setState({
                ...this.state,
                stats, 
            })
        })
        .catch(err => {
            throw err            
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
                        this.state.event && this.state.stats && <Stepper event={this.state.event} stats={this.state.stats} />
                    }
                    {
                        this.state.event == null &&
                        <IonLoading
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
